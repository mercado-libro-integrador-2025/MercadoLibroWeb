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
from django.shortcuts import redirect
from django.db import transaction

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
            "success": "https://mercadolibroweb.onrender.com/api/pago/success",
            "failure": "https://mercadolibroweb.onrender.com/api/pago/failure",
            "pending": "https://mercadolibroweb.onrender.com/api/pago/pending"
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
    return redirect("http://localhost:4200/dashboard/profile-dashboard")  

def pago_pending(request):
    return redirect("http://localhost:4200/dashboard/profile-dashboard")

def pago_failure(request):
    return redirect("http://localhost:4200/dashboard/profile-dashboard")


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

    def destroy(self, request, *args, **kwargs):
        direccion = self.get_object()
        if direccion.usuario == request.user:
            direccion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "No tienes permiso para eliminar esta dirección."}, status=status.HTTP_403_FORBIDDEN)

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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        libro = serializer.validated_data['libro']
        cantidad_a_agregar = serializer.validated_data['cantidad']
        usuario = self.request.user

        libro_actual = Libro.objects.select_for_update().get(pk=libro.id_libro)

        item_existente = ItemCarrito.objects.filter(usuario=usuario, libro=libro).first()

        if item_existente:
            cantidad_final = item_existente.cantidad + cantidad_a_agregar
            if libro_actual.stock < cantidad_a_agregar:
                return Response({"detail": f"No hay suficiente stock para agregar {cantidad_a_agregar} unidades adicionales de este libro."}, status=status.HTTP_400_BAD_REQUEST)

            item_existente.cantidad = cantidad_final
            item_existente.save()
            libro_actual.stock -= cantidad_a_agregar
            libro_actual.save()

            response_serializer = self.get_serializer(item_existente)
            headers = self.get_success_headers(response_serializer.data) # <-- Aquí está el cambio
            return Response(response_serializer.data, status=status.HTTP_200_OK, headers=headers)
        else:
            if libro_actual.stock < cantidad_a_agregar:
                return Response({"detail": f"No hay suficiente stock para agregar {cantidad_a_agregar} unidades de este libro."}, status=status.HTTP_400_BAD_REQUEST)

            item_nuevo = ItemCarrito.objects.create(
                usuario=usuario,
                libro=libro_actual,
                cantidad=cantidad_a_agregar
            )
            libro_actual.stock -= cantidad_a_agregar
            libro_actual.save()

            response_serializer = self.get_serializer(item_nuevo)
            headers = self.get_success_headers(response_serializer.data) # <-- Aquí está el cambio
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def perform_destroy(self, instance):
        libro = instance.libro
        cantidad = instance.cantidad
        libro.stock += cantidad
        libro.save()
        instance.delete()

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def listar_por_usuario(self, request, usuario_id=None):
        if usuario_id is None:
            return Response({"error": "ID de usuario no proporcionado."}, status=status.HTTP_400_BAD_REQUEST)

        pedidos = Pedido.objects.filter(usuario_id=usuario_id)
        if not pedidos.exists():
            return Response({"error": "No se encontraron pedidos para este usuario."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReseñaViewSet(viewsets.ModelViewSet):
    queryset = Reseña.objects.all()
    serializer_class = ReseñaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get'], url_path='mis-resenas') 
    def mis_resenas(self, request):
        if request.user.is_authenticated:
            queryset = self.get_queryset().filter(usuario=request.user)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response(
                {"detail": "La autenticación es requerida para acceder a tus reseñas."},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(detail=False, methods=['get'], url_path='usuario/(?P<usuario_id>[^/.]+)')
    def reseñas_por_usuario(self, request, usuario_id=None):
        if usuario_id is None:
            return Response({"detail": "ID de usuario no proporcionado."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = CustomUser.objects.get(id=usuario_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset().filter(usuario=user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
