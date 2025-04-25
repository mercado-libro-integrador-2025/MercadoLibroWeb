from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email=models.EmailField(max_length=150, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    rol = models.TextField(default='Cliente')
    usuario = models.ForeignKey(CustomUser, related_name='roles', on_delete=models.CASCADE)

    class Meta:
        db_table = 'rol'

    def __unicode__(self):
        return self.rol

    def __str__(self):
        return self.rol

class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100)

    class Meta:
        db_table = 'categoria'

    def __unicode__(self):
        return self.nombre_categoria

    def __str__(self):
        return self.nombre_categoria

class Autor(models.Model):
    id_autor = models.AutoField(primary_key=True)
    nombre_autor = models.CharField(max_length=200)

    class Meta:
        db_table = 'autor'

    def __unicode__(self):
        return self.nombre_autor

    def __str__(self):
        return self.nombre_autor

def get_upload_path(instance, filename):
    return f'libros/{instance.titulo}/{filename}'

class Libro(models.Model):
    id_libro = models.AutoField(primary_key=True)
    titulo = models.CharField(blank= False, max_length=255)
    precio = models.DecimalField(blank= False, max_digits=10, decimal_places=2)
    stock = models.IntegerField(blank= False)
    id_categoria = models.ForeignKey(Categoria, to_field='id_categoria', on_delete=models.CASCADE)
    descripcion = models.TextField(blank= False)
    portada = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    id_autor = models.ForeignKey(Autor, to_field='id_autor', on_delete=models.CASCADE)

    class Meta:
        db_table = 'libro'

    def __unicode__(self):
        return self.titulo

    def __str__(self):
        return self.titulo

class Direccion(models.Model):
    usuario = models.ForeignKey(CustomUser, related_name='direcciones', on_delete=models.CASCADE)
    calle = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    provincia = models.CharField(max_length=100,)
    codigo_postal = models.CharField(max_length=20)

    class Meta:
        db_table = 'direccion'

    def __unicode__(self):
        return f'{self.calle}, {self.ciudad}, {self.provincia}'

    def __str__(self):
        return f'{self.calle}, {self.ciudad}, {self.provincia}'

class FormaEnvio(models.Model):
    id_forma_envio = models.AutoField(primary_key=True)
    forma_envio = models.CharField(max_length=100)

    class Meta:
        db_table = 'forma_envio'
    
    def __unicode__(self):
        return self.forma_envio

    def __str__(self):
        return self.forma_envio

class FormaPago(models.Model):
    id_forma_pago = models.AutoField(primary_key=True)
    forma_pago = models.CharField(max_length=100)

    class Meta:
        db_table = 'forma_pago'

    def __unicode__(self):
        return self.forma_pago

    def __str__(self):
        return self.forma_pago

class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(CustomUser, related_name='pedidos_pedido', on_delete=models.CASCADE)
    estado_pedido = models.CharField(max_length=50)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    direccion_envio = models.ForeignKey(Direccion, on_delete=models.SET_NULL, null=True, related_name='pedidos')
    forma_envio = models.ForeignKey(FormaEnvio, on_delete=models.SET_NULL, null=True, related_name='pedidos')
    forma_pago = models.ForeignKey(FormaPago, on_delete=models.SET_NULL, null=True, related_name='pedidos')

    class Meta:
        db_table = 'pedido'

    def __str__(self):
        return f'Pedido {self.id_pedido}'

class EstadoPedido(models.Model):
    id_estado = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(Pedido, related_name='estados_pedido', on_delete=models.CASCADE)
    estado_pedido = models.CharField(default='En preparación', max_length=100)
    
    class Meta:
        db_table = 'estado_pedido'

    def __str__(self):
        return self.estado_pedido

    def __str__(self):
        return self.estado_pedido

class HistorialPedido(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(Pedido, related_name='historial', on_delete=models.CASCADE, default=1)
    libro = models.ForeignKey(Libro, related_name='historial_pedido', on_delete=models.CASCADE, default=1)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado_pedido = models.CharField(max_length=50, default=1)

    class Meta:
        db_table = 'historial_pedido'

    def __str__(self):
        return f'Historial {self.id_historial} - Pedido {self.id_pedido}'


class Reseña(models.Model):
    id_resena = models.AutoField(primary_key=True)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE, related_name='resenas')
    usuario = models.ForeignKey(CustomUser, related_name='resenas_usuario', on_delete=models.CASCADE)
    comentario = models.TextField()
    calificacion = models.IntegerField()
    fecha_resena = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resena'
    
    def __unicode__(self):
        return f'Reseña {self.id_resena} - {self.calificacion}'

    def __str__(self):
        return f'Reseña {self.id_resena} - {self.calificacion}'