from django.urls import path, include
from rest_framework import routers
from .views import LoginView, LogoutView, SignupView, RolViewSet, CategoriaViewSet, AutorViewSet, LibroViewSet, \
    DireccionViewSet, FormaEnvioViewSet, FormaPagoViewSet, PedidoViewSet, EstadoPedidoViewSet, HistorialPedidoViewSet, \
    ReseñaViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'libros', LibroViewSet)
router.register(r'direcciones', DireccionViewSet)
router.register(r'formasenvio', FormaEnvioViewSet)
router.register(r'formaspago', FormaPagoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'estadospedido', EstadoPedidoViewSet)
router.register(r'historialespedido', HistorialPedidoViewSet)
router.register(r'resenas', ReseñaViewSet)
router.register(r'usuarios', UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
]