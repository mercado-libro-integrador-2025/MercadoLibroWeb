from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Categoria, Libro, Autor, ItemCarrito, Pedido, Direccion, Reseña

@admin.register(get_user_model())
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'password')

class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre_categoria',)

class AutorAdmin(admin.ModelAdmin):
    list_display = ('nombre_autor',)

class LibroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'portada', 'categoria', 'autor', 'descripcion', 'precio', 'stock')

class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'direccion', 'id_transaccion_mp', 'fecha_pedido', 'total', 'estado')
    search_fields = ('usuario__email',)
    list_filter = ('estado', 'fecha_pedido')

class ItemCarritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'libro', 'cantidad')
    search_fields = ('usuario__email', 'libro__titulo')
    list_filter = ('fecha_agregado',)

class DireccionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'calle', 'numero', 'ciudad', 'provincia')
    search_fields = ('usuario__email', 'calle', 'numero', 'ciudad', 'provincia')

class ReseñaAdmin(admin.ModelAdmin):
    list_display = ('libro', 'usuario', 'comentario', 'fecha_creacion')
    search_fields = ('usuario__email', 'libro__titulo')  
    list_filter = ('libro', 'usuario')

admin.site.register(Categoria, CategoriaAdmin) 
admin.site.register(Autor, AutorAdmin)         
admin.site.register(Libro, LibroAdmin) 
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(ItemCarrito, ItemCarritoAdmin)
admin.site.register(Direccion, DireccionAdmin)
admin.site.register(Reseña, ReseñaAdmin)