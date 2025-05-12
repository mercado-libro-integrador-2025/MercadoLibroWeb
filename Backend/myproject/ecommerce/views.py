import mercadopago
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from django.contrib.auth import authenticate, login, logout
from rest_framework import status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSelfOrAdmin
from .models import (
    CustomUser,
    Categoria,
    Autor,
    Libro,
    ItemCarrito,
    Pedido,
    ProductoPedido,
    Direccion,
    MetodoPago,
    Reseña,
    Contacto
)
from .serializers import (
    UserSerializer,
    CategoriaSerializer,
    AutorSerializer,
    LibroSerializer,
    ItemCarritoSerializer, 
    PedidoSerializer,
    DireccionSerializer,
    MetodoPagoSerializer,
    ReseñaSerializer,
    ContactoSerializer
)
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.http import HttpResponse
from decimal import Decimal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_preferencia(request):
    usuario = request.user
    productos = request.data.get('productos', [])

    if not productos:
        return Response({'error': 'No hay productos en el carrito.'}, status=400)

    # Configurar MercadoPago con el Access Token
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    # Construir los items para la preferencia
    items = []
    for producto in productos:
        items.append({
            "title": producto.get('titulo'),
            "quantity": int(producto.get('cantidad')),
            "unit_price": float(producto.get('precio')),
            "currency_id": "ARS"
        })

    # Crear la preferencia
    preference_data = {
        "items": items,
        "payer": {
            "email": usuario.email
        },
        "back_urls": {
            "success": "https://mercadolibroweb.onrender.com/pago/success",
            "failure": "https://mercadolibroweb.onrender.com/pago/failure",
            "pending": "https://mercadolibroweb.onrender.com/pago/pending"
        },
        "auto_return": "approved"
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        preference_id = preference_response["response"]["id"]
        return Response({"id": preference_id})
    except Exception as e:
        return Response({'error': f'Error al crear la preferencia: {str(e)}'}, status=500)

def pago_success(request):
    return render(request, 'pago/success.html')  # o HttpResponse("Pago aprobado")

def pago_pending(request):
    return render(request, 'pago/pending.html')  # o HttpResponse("Pago pendiente")

def pago_failure(request):
    return render(request, 'pago/failure.html')  # o HttpResponse("Pago fallido")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmar_pedido(request):
    usuario = request.user

    # Obtener productos en el carrito del usuario
    items_carrito = ItemCarrito.objects.filter(usuario=usuario)
    if not items_carrito:
        return Response({"error": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

    # Validar dirección de envío
    direccion = get_object_or_404(Direccion, usuario=usuario)
    if not direccion:
        return Response({"error": "No tienes una dirección registrada."}, status=status.HTTP_400_BAD_REQUEST)

    # Validar método de pago
    metodo_pago = get_object_or_404(MetodoPago, usuario=usuario)
    if not metodo_pago:
        return Response({"error": "No tienes un método de pago registrado."}, status=status.HTTP_400_BAD_REQUEST)

    # Calcular el total del pedido
    total_pedido = Decimal(0)
    for item in items_carrito:
        total_pedido += item.total

    # Crear el pedido
    pedido = Pedido.objects.create(
        usuario=usuario,
        direccion=direccion,
        metodo_pago=metodo_pago.tipo_tarjeta,
        total=total_pedido
    )

    # Crear los productos del pedido
    for item in items_carrito:
        ProductoPedido.objects.create(
            pedido=pedido,
            libro=item.libro,
            cantidad=item.cantidad,
            precio_unitario=item.libro.precio
        )

        # Actualizar el stock del libro
        item.libro.stock -= item.cantidad
        item.libro.save()

        # Eliminar el item del carrito
        item.delete()

    return Response({
        "message": "Pedido confirmado exitosamente.",
        "pedido_id": pedido.id_pedido,
        "total": total_pedido
    }, status=status.HTTP_201_CREATED)

class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = CustomUser.objects.get(email=request.data['email'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'user_id': user.id,  # Agrega el user_id aquí
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        user = authenticate(email=email, password=password)

        if user:
            if not user.is_active:
                return Response({'error': 'Tu cuenta ha sido desactivada. Contacta al soporte.'}, status=status.HTTP_403_FORBIDDEN)
            
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_404_NOT_FOUND)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user == request.user or request.user.is_staff: 
            user.is_active = False  
            user.save()
            return Response({'message': 'Cuenta desactivada exitosamente.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'No tienes permiso para eliminar esta cuenta'}, status=status.HTTP_403_FORBIDDEN)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    filter_backends = [DjangoFilterBackend]
    
class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Direccion.objects.filter(usuario=self.request.user)  

class MetodoPagoViewSet(viewsets.ModelViewSet):
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MetodoPago.objects.filter(usuario=self.request.user) 

class ItemCarritoViewSet(viewsets.ModelViewSet):
    queryset = ItemCarrito.objects.all()
    serializer_class = ItemCarritoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItemCarrito.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        libro = serializer.validated_data['libro']
        cantidad = serializer.validated_data['cantidad']
        usuario = self.request.user

        # Verificar si el item ya existe en el carrito
        item, created = ItemCarrito.objects.get_or_create(
            usuario=usuario,
            libro=libro,
            defaults={'cantidad': cantidad}
        )

        if not created:
            # Si ya existe, actualizar la cantidad
            item.cantidad += cantidad
            item.save()
        else:
            # Si no existe, decrementar el stock y guardar el nuevo item
            if libro.stock < cantidad:
                raise serializers.ValidationError("No hay suficiente stock disponible.")
            libro.stock -= cantidad
            libro.save()
            serializer.save(usuario=usuario)

class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    queryset = Pedido.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(usuario=self.request.user)  

    def perform_create(self, serializer):
        raise serializers.ValidationError("El pedido debe ser confirmado a través del endpoint 'confirmar-pedido'.")


class ReseñaViewSet(viewsets.ModelViewSet):
    queryset = Reseña.objects.all()
    serializer_class = ReseñaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
