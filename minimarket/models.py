from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings
import uuid
from django.contrib.auth.models import User

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
    id_detalle = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cliente = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    email_cliente = models.EmailField(null=True)
    direccion_cliente = models.CharField(max_length=255,null=True) 
    cantidad = models.IntegerField()
    total = models.FloatField()
    
    def __str__(self):
        return f"{self.cliente.email} - {self.id_producto.nombre}"

    def save(self, *args, **kwargs):
        if not self.email_cliente:
            self.email_cliente = self.cliente.email
        if not self.direccion_cliente:
            self.direccion_cliente = self.cliente.last_name
        super().save(*args, **kwargs)

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
    nombre = models.BinaryField()
    apellido = models.CharField(max_length=50)
    correo = models.EmailField()
    tipo_solicitud = models.CharField(max_length=10, choices=OPCIONES_SOLICITUD)
    comentario = models.CharField(max_length=300)

    def __str__(self):
        return str(self.tipo_solicitud)
    #Metodo para encriptar el nombre
    def set_nombre(self, nombre):
        cipher = Fernet(settings.KEY) # Se obtiene la clave de settings.py
        self.nombre = cipher.encrypt(nombre.encode('utf-8'))
    #Metodo para desencriptar el nombre
    def get_nombre(self):
        cipher = Fernet(settings.KEY) # Se obtiene la clave de settings.py
        return cipher.decrypt(self.nombre).decode('utf-8')
    
    

