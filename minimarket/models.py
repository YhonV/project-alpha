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
    
