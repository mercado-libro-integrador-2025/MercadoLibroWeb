from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Categoria, Libro, Autor, Direccion, FormaEnvio, FormaPago, Pedido, EstadoPedido, HistorialPedido, Reseña, Rol

@admin.register(get_user_model())
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'password')

class RolAdmin(admin.ModelAdmin):
    list_display = ('rol', 'usuario')

class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre_categoria',)

class AutorAdmin(admin.ModelAdmin):
    list_display = ('nombre_autor',)

class LibroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'portada', 'id_categoria', 'id_autor', 'descripcion', 'precio', 'stock')

class DireccionAdmin(admin.ModelAdmin):
    list_display = ('calle', 'ciudad', 'provincia', 'codigo_postal')

class FormaEnvioAdmin(admin.ModelAdmin):
    list_display = ('forma_envio',)

class FormaPagoAdmin(admin.ModelAdmin):
    list_display = ('forma_pago',)

class PedidoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'estado_pedido', 'fecha_pedido', 'direccion_envio', 'forma_envio', 'forma_pago')

class EstadoPedidoAdmin(admin.ModelAdmin):
    list_display = ('estado_pedido', 'id_pedido')

class HistorialPedidoAdmin(admin.ModelAdmin):
    list_display = ('id_pedido', 'estado_pedido', 'fecha_pedido')

class ReseñaAdmin(admin.ModelAdmin):
    list_display = ('libro', 'usuario', 'comentario', 'calificacion', 'fecha_resena')

admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Rol, RolAdmin)
admin.site.register(Libro, LibroAdmin)
admin.site.register(Autor, AutorAdmin)
admin.site.register(Direccion, DireccionAdmin)
admin.site.register(FormaEnvio, FormaEnvioAdmin)
admin.site.register(FormaPago, FormaPagoAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(EstadoPedido, EstadoPedidoAdmin)
admin.site.register(HistorialPedido, HistorialPedidoAdmin)
admin.site.register(Reseña, ReseñaAdmin)
