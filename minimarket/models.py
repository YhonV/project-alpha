from django.db import models
import uuid

# Create your models here.
class Producto(models.Model):
    id_producto = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    precio = models.FloatField()
    stock = models.IntegerField()
    imagen = models.ImageField(upload_to='static/img', null=True)
    id_categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE)
    
    
    def __str__(self):
        return self.nombre + ' ' + self.id_producto + ' ' + self.stock
    
class Categoria(models.Model):
    id_categoria = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    
    
    