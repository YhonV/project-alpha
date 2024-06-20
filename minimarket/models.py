from django.db import models
import uuid

class Categoria(models.Model):
    nombre_categoria = models.CharField(primary_key=True,max_length=100)
    
    def __str__(self):
        return self.nombre_categoria

class Producto(models.Model):
    id_producto = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    precio = models.FloatField()
    stock = models.IntegerField()
    imagen = models.ImageField(upload_to='productos/', null=True)
    nombre_categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre  
    
class Cliente (models.Model):
    id_cliente = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    nombre_completo = models.CharField(max_length=100)
    correo = models.EmailField()
    direccion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre_completo
    
class detalleCompra(models.Model):
    id_detalle = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    total = models.FloatField()
    
    def __str__(self):
        return self.id_detalle

class formularioContacto(models.Model):
    CONSULTA = 'CONSULTA'
    RECLAMO = 'RECLAMO'
    SUGERENCIA = 'SUGERENCIA'
    OTRO = 'OTRO'

    OPCIONES_SOLICITUD = [
        (CONSULTA, 'Consulta'),
        (RECLAMO, 'Reclamo'),
        (SUGERENCIA, 'Sugerencia'),
        (OTRO, 'Otro'),
    ]
    
    id_formulario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    correo = models.EmailField()
    tipo_solicitud = models.CharField(max_length=10, choices=OPCIONES_SOLICITUD)
    comentario = models.CharField(max_length=300)

    def __str__(self):
        return str(self.tipo_solicitud)

