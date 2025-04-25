from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from django.contrib.auth import authenticate, login, logout
from rest_framework import status, generics
from rest_framework.response import Response 
from rest_framework.views import APIView
from .models import (
    CustomUser,
    Categoria,
    Autor,
    Libro,
    Direccion,
    FormaEnvio,
    FormaPago,
    Pedido,
    EstadoPedido,
    HistorialPedido,
    Reseña,
    Rol
)
from .serializers import (
    CategoriaSerializer,
    AutorSerializer,
    HistorialPedidoSerializer,
    LibroSerializer,
    DireccionSerializer,
    FormaEnvioSerializer,
    FormaPagoSerializer,
    PedidoSerializer,
    EstadoPedidoSerializer,
    ReseñaSerializer,
    RolSerializer, 
    UserSerializer
)


class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer
    
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        user = authenticate(email=email, password=password)

        if user:
            login(request, user)
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid Credentials'},
            status=status.HTTP_404_NOT_FOUND)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

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
    filterset_fields = {
        'titulo': ['icontains'],
        'id_categoria__nombre_categoria': ['exact'],
    }

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer

class FormaEnvioViewSet(viewsets.ModelViewSet):
    queryset = FormaEnvio.objects.all()
    serializer_class = FormaEnvioSerializer
    

class FormaPagoViewSet(viewsets.ModelViewSet):
    queryset = FormaPago.objects.all()
    serializer_class = FormaPagoSerializer
    

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    

class EstadoPedidoViewSet(viewsets.ModelViewSet):
    queryset = EstadoPedido.objects.all()
    serializer_class = EstadoPedidoSerializer
    

class HistorialPedidoViewSet(viewsets.ModelViewSet):
    queryset = HistorialPedido.objects.all()
    serializer_class = HistorialPedidoSerializer
    def list(self, request, cliente_id=None):
        pedidos = Pedido.objects.filter(usuario_id=cliente_id)
        detalles_pedidos = []

        for pedido in pedidos:
            detalles = HistorialPedido.objects.filter(id_pedido=pedido)
            for detalle in detalles:
                detalles_pedidos.append({
                    'direccion_envio': f'{pedido.direccion_envio.calle}, {pedido.direccion_envio.ciudad}, {pedido.direccion_envio.provincia}',
                    'estado_pedido': detalle.estado_pedido,
                    'fecha_pedido': detalle.fecha_pedido,
                    'titulo_libro': detalle.libro.titulo,
                    'cantidad': detalle.cantidad,
                    'precio_total': detalle.precio_total,
                })

        return Response({'detalles_pedidos': detalles_pedidos})
    

class ReseñaViewSet(viewsets.ModelViewSet):
    queryset = Reseña.objects.all()
    serializer_class = ReseñaSerializer
    