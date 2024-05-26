from django.contrib import admin

from minimarket.models import Categoria, Producto

# Register your models here.

@admin.register(Producto)
class ProductosAdmin(admin.ModelAdmin):
    pass

@admin.register(Categoria)
class CategoriasAdmin(admin.ModelAdmin):
    pass