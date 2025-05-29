from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import (
    Categoria,
    Autor,
    Libro,
    Pedido,
    ItemCarrito,
    Direccion,
    Reseña, 
    Contacto
)

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return get_user_model().objects.create(**validated_data)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'username', 'password')


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ('id_categoria', 'nombre_categoria') 

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = ('id_autor', 'nombre_autor')  

class LibroSerializer(serializers.ModelSerializer):
    autor = AutorSerializer(read_only=True)  
    categoria = CategoriaSerializer(read_only=True)  

    class Meta:
        model = Libro
        fields = '__all__' 

class LibroCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__' 

class NovedadLibroSerializer(serializers.ModelSerializer):
    id_libro = serializers.IntegerField(source='pk')
    autor = AutorSerializer()
    categoria = CategoriaSerializer()

    class Meta:
        model = Libro
        fields = '__all__' 

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = ['id', 'calle', 'numero', 'ciudad', 'provincia']

    def create(self, validated_data):
        return Direccion.objects.create(usuario=self.context['request'].user, **validated_data)

class ItemCarritoSerializer(serializers.ModelSerializer):
    email_usuario = serializers.EmailField(source='usuario.email', read_only=True)
    titulo_libro = serializers.CharField(source='libro.titulo', read_only=True)
    precio_unitario = serializers.DecimalField(source='libro.precio', max_digits=10, decimal_places=2, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = ItemCarrito
        fields = ['id', 'libro', 'usuario', 'email_usuario', 'titulo_libro', 'cantidad', 'precio_unitario', 'total']

    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError("La cantidad debe ser al menos 1.")
        return value

    def get_total(self, obj):
        return obj.total

    def update(self, instance, validated_data):
        cantidad_nueva = validated_data.get('cantidad', instance.cantidad)
        libro = instance.libro

        cantidad_actual = instance.cantidad
        diferencia_cantidad = cantidad_nueva - cantidad_actual

        if diferencia_cantidad > 0 and libro.stock < diferencia_cantidad:
            raise serializers.ValidationError(f"No hay suficiente stock para aumentar la cantidad a {cantidad_nueva}. Stock disponible: {libro.stock + cantidad_actual}.")
        elif cantidad_nueva < 1:
            raise serializers.ValidationError("La cantidad no puede ser menor a 1.")

        libro.stock -= diferencia_cantidad
        libro.save()

        instance.cantidad = cantidad_nueva
        instance.save()
        return instance

class PedidoSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer(read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'direccion', 'id_transaccion_mp', 'estado', 'fecha_pedido', 'total']


class ReseñaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    titulo_libro = serializers.CharField(source='libro.titulo', read_only=True)
    email_usuario = serializers.EmailField(source='usuario.email', read_only=True)
    
    class Meta:
        model = Reseña
        fields = ['id', 'libro','titulo_libro', 'email_usuario', 'comentario', 'fecha_creacion']

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = ['nombre', 'email', 'asunto', 'mensaje']
