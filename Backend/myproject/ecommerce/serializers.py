from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import (
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

def validate_password(self, value):
    return make_password

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8)

    def create(self, validated_data):
        user = get_user_model().objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            password=make_password(validated_data['password'])
        )
        return user

    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'password')

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ('nombre_categoria',)

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = ('nombre_autor',)

class LibroSerializer(serializers.ModelSerializer):
    autor = serializers.SerializerMethodField()
    categoria = serializers.SerializerMethodField()

    class Meta:
        model = Libro
        fields = '__all__'

    def get_autor(self, obj):
        return obj.id_autor.nombre_autor 

    def get_categoria(self, obj):
        return obj.id_categoria.nombre_categoria

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class FormaEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormaEnvio
        fields = '__all__'

class FormaPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormaPago
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = '__all__'

class HistorialPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPedido
        fields = '__all__'

class ReseñaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reseña
        fields = '__all__'