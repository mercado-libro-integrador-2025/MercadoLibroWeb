from django.urls import path, include
from rest_framework import routers
from .views import LoginView, LogoutView, SignupView, UserViewSet, CategoriaViewSet, AutorViewSet, LibroViewSet, \
ItemCarritoViewSet, PedidoViewSet, DireccionViewSet, ReseñaViewSet, ContactoViewSet, crear_preferencia, NovedadesListView
from . import views

router = routers.DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'libros', LibroViewSet)
router.register(r'carrito', ItemCarritoViewSet)
router.register(r'direcciones', DireccionViewSet, basename='direccion')
router.register(r'resenas', ReseñaViewSet)
router.register(r'contacto', ContactoViewSet)
router.register(r'pedidos', PedidoViewSet, basename='pedido')


urlpatterns = [
    path('', include(router.urls)),
    path('novedades/', NovedadesListView.as_view(), name='novedades_list'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
    path('checkout/crear-preferencia/', crear_preferencia, name='crear_preferencia'),
    path('pago/success', views.pago_success, name='pago_success'),
    path('pago/pending', views.pago_pending, name='pago_pending'),
    path('pago/failure', views.pago_failure, name='pago_failure'),
    path('pedidos/usuario/<int:usuario_id>/', PedidoViewSet.as_view({'get': 'listar_por_usuario'}), name='pedidos-usuario'),
]