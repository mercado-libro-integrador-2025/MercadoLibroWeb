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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmar_pedido(request):
    usuario = request.user
    direccion_id = request.data.get('direccion_id')
    metodo_pago = request.data.get('metodo_pago')
    productos = request.data.get('productos')
    total = request.data.get('total')

    if not direccion_id or not metodo_pago or not productos:
        return Response({'error': 'Faltan datos para confirmar el pedido.'}, status=400)

    direccion = get_object_or_404(Direccion, id=direccion_id, usuario=usuario)
    pedido = Pedido.objects.create(
        usuario=usuario,
        direccion=direccion,
        metodo_pago=metodo_pago,
        total=total
    )

    for producto in productos:
        libro = get_object_or_404(Libro, id=producto['id'])
        ProductoPedido.objects.create(
            pedido=pedido,
            libro=libro,
            cantidad=producto['cantidad'],
            precio_unitario=producto['precio']
        )

        # Reducir el stock del libro
        libro.stock -= producto['cantidad']
        libro.save()

    # Limpiar el carrito del usuario
    ItemCarrito.objects.filter(usuario=usuario).delete()

    return Response({'message': 'Pedido registrado exitosamente.'}, status=201)


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
