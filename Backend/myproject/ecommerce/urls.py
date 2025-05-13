from django.urls import path, include
from rest_framework import routers
from .views import LoginView, LogoutView, SignupView, UserViewSet, CategoriaViewSet, AutorViewSet, LibroViewSet, \
<<<<<<< HEAD
ItemCarritoViewSet, PedidoViewSet, DireccionViewSet, MetodoPagoViewSet, ReseñaViewSet, ContactoViewSet, confirmar_pedido, crear_preferencia
from . import views
=======
ItemCarritoViewSet, PedidoViewSet, DireccionViewSet, MetodoPagoViewSet, ReseñaViewSet, ContactoViewSet
>>>>>>> e76d6427f9ee176a7ae747983d0cee56ed908870

router = routers.DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'libros', LibroViewSet)
router.register(r'carrito', ItemCarritoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'direcciones', DireccionViewSet)
router.register(r'metodopagos', MetodoPagoViewSet)
router.register(r'resenas', ReseñaViewSet)
router.register(r'contacto', ContactoViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
<<<<<<< HEAD
    path('checkout/crear-preferencia/', crear_preferencia, name='crear_preferencia'),
    path('api/confirmar-pedido/', confirmar_pedido, name='confirmar_pedido'),
    path('pago/success', views.pago_success, name='pago_success'),
    path('pago/pending', views.pago_pending, name='pago_pending'),
    path('pago/failure', views.pago_failure, name='pago_failure'),
=======
>>>>>>> e76d6427f9ee176a7ae747983d0cee56ed908870
]