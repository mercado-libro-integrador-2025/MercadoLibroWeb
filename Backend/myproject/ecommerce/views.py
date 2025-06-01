import mercadopago
import traceback
import logging
from rest_framework import viewsets
from rest_framework import status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect 
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.db import transaction
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate, login, logout
from .permissions import IsSelfOrAdmin
from decimal import Decimal
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsSelfOrAdmin
from decimal import Decimal
from .models import (
    CustomUser,
    Categoria,
    Autor,
    Libro,
    ItemCarrito,
    Pedido,
    Direccion,
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
    ReseñaSerializer,
    ContactoSerializer,
    NovedadLibroSerializer
)


FRONTEND_WEB_URL_PROD = "https://localhost:4200/checkout-success"

MOBILE_DEEPLINK_BASE = "mercadolibromobile://checkout"

BACKEND_IPN_URL_BASE = "https://mercadolibroweb.onrender.com/api/pago/" if not settings.DEBUG else "http://localhost:8000/api/pago/"

# === FUNCIÓN PARA CREAR PREFERENCIA DE MERCADO PAGO ===

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_preferencia(request):
    usuario = request.user
    productos_data = request.data.get('productos', [])
    direccion_id = request.data.get('direccion_id')
    is_mobile_app = request.data.get('is_mobile_app', False) 
    if not productos_data:
        return Response({'error': 'No hay productos en el carrito.'}, status=status.HTTP_400_BAD_REQUEST)

    if not direccion_id:
        return Response({'error': 'Debe seleccionar una dirección de envío.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        direccion = Direccion.objects.get(id=direccion_id, usuario=usuario)
    except Direccion.DoesNotExist:
        return Response({'error': 'La dirección proporcionada no es válida o no pertenece al usuario.'}, status=status.HTTP_400_BAD_REQUEST)

    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    items = []
    total_pedido = Decimal('0.00')
    libros_en_pedido = []

    for producto_data in productos_data:
        try:
            libro = Libro.objects.get(id_libro=producto_data.get('id_libro'))
            cantidad = int(producto_data.get('cantidad'))

            if cantidad <= 0:
                raise ValueError("La cantidad debe ser mayor a 0.")
            if libro.stock < cantidad:
                raise ValueError(f"Stock insuficiente para el libro {libro.titulo}. Solo quedan {libro.stock}.")

            items.append({
                "title": libro.titulo,
                "quantity": cantidad,
                "unit_price": float(libro.precio),
                "currency_id": "ARS"
            })
            total_pedido += libro.precio * cantidad
            libros_en_pedido.append({'libro': libro, 'cantidad': cantidad})

        except Libro.DoesNotExist:
            return Response({'error': f"El libro con ID {producto_data.get('id_libro')} no existe."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e: 
            print(f"Error detallado en crear_preferencia (dentro del bucle): {str(e)}")
            traceback.print_exc()
            return Response({'error': f'Error interno al procesar productos: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    with transaction.atomic():
        try:
            for item_info in libros_en_pedido:
                libro = item_info['libro']
                cantidad = item_info['cantidad']
                libro.stock -= cantidad
                libro.save()

            pedido = Pedido.objects.create(
                usuario=usuario,
                direccion=direccion,
                total=total_pedido,
                estado='pendiente'
            )

            preference_data = {
                "items": items,
                "payer": {
                    "email": usuario.email
                },
                "auto_return": "approved",
                "external_reference": str(pedido.id),
                "notification_url": f"{BACKEND_IPN_URL_BASE}success?external_reference={pedido.id}"
            }

            if is_mobile_app:
                preference_data["back_urls"] = {
                    "success": f"{MOBILE_DEEPLINK_BASE}/success?external_reference={pedido.id}",
                    "failure": f"{MOBILE_DEEPLINK_BASE}/failure?external_reference={pedido.id}",
                    "pending": f"{MOBILE_DEEPLINK_BASE}/pending?external_reference={pedido.id}"
                }
            else:
                preference_data["back_urls"] = {
                    "success": f"{FRONTEND_WEB_URL_PROD}/checkout-success?external_reference={pedido.id}",
                    "failure": f"{FRONTEND_WEB_URL_PROD}/checkout-failure?external_reference={pedido.id}",
                    "pending": f"{FRONTEND_WEB_URL_PROD}/checkout-pending?external_reference={pedido.id}"
                }

            preference_response = sdk.preference().create(preference_data)
            logger.info(f"Respuesta completa de Mercado Pago: {preference_response}") 

            preference_id = preference_response["response"]["id"]
            init_point = preference_response["response"]["init_point"]

            pedido.id_transaccion_mp = preference_id
            pedido.save()

            ItemCarrito.objects.filter(usuario=usuario).delete()

            return Response({"id": preference_id, "init_point": preference_response["response"]["init_point"]})

        except Exception as e:
            print(f"Error detallado en crear_preferencia (fuera del bucle/transacción): {str(e)}")
            traceback.print_exc()
            return Response({'error': f'Error al crear la preferencia o el pedido: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# === FUNCIONES DE PROCESAMIENTO DE PAGOS (IPN y/o BACK_URLS) ===

def pago_success(request):
    payment_id = request.GET.get('payment_id')
    status_mp = request.GET.get('status')
    external_reference = request.GET.get('external_reference')

    if external_reference:
        try:
            pedido = Pedido.objects.get(id=external_reference)
            if status_mp == 'approved':
                pedido.estado = 'pagado'
                pedido.id_transaccion_mp = payment_id
            else: 
                pedido.estado = 'fallido' 
            pedido.save()
        except Pedido.DoesNotExist:
            print(f"Pedido con external_reference {external_reference} no encontrado en pago_success.")
        except Exception as e:
            print(f"Error al actualizar pedido en pago_success: {e}")
            traceback.print_exc() 

    return HttpResponse(status=200) 

def pago_pending(request):
    payment_id = request.GET.get('payment_id')
    status_mp = request.GET.get('status')
    external_reference = request.GET.get('external_reference')

    if external_reference:
        try:
            pedido = Pedido.objects.get(id=external_reference)
            pedido.estado = 'pendiente_mp'
            if payment_id:
                pedido.id_transaccion_mp = payment_id
            pedido.save()
        except Pedido.DoesNotExist:
            print(f"Pedido con external_reference {external_reference} no encontrado en pago_pending.")
        except Exception as e:
            print(f"Error al actualizar pedido en pago_pending: {e}")
            traceback.print_exc()

    return HttpResponse(status=200) 

def pago_failure(request):
    payment_id = request.GET.get('payment_id')
    status_mp = request.GET.get('status')
    external_reference = request.GET.get('external_reference')

    if external_reference:
        with transaction.atomic():
            try:
                pedido = Pedido.objects.select_for_update().get(id=external_reference)
                pedido.estado = 'fallido'
                if payment_id:
                    pedido.id_transaccion_mp = payment_id
                pedido.save()

            except Pedido.DoesNotExist:
                print(f"Pedido con external_reference {external_reference} no encontrado en pago_failure.")
            except Exception as e:
                print(f"Error al actualizar pedido y/o revertir stock en pago_failure: {e}")
                traceback.print_exc() 

    return HttpResponse(status=200) 

class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = CustomUser.objects.get(email=request.data['email'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'user_id': user.id,  
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

class NovedadesListView(APIView):
    def get(self, request, *args, **kwargs):
        novedades = Libro.objects.filter(es_novedad=True)
        serializer = NovedadLibroSerializer(novedades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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

    def get_queryset(self):
        return Pedido.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=['get'], url_path='por-usuario/(?P<usuario_id>[^/.]+)')
    def listar_por_usuario(self, request, usuario_id=None):
        if usuario_id is None:
            return Response({"error": "ID de usuario no proporcionado."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not (str(request.user.id) == usuario_id or request.user.is_staff):
            return Response({"error": "No tienes permiso para ver los pedidos de este usuario."}, status=status.HTTP_403_FORBIDDEN)

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
