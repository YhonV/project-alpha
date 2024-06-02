from django.shortcuts import render
from .models import Producto

# Create your views here.

def inicio(request):
    return render(request,'index.html')

def catalogo(request):
    
    productos = Producto.objects.all()
    contexto = {'productos':productos}
    
    return render(request, 'catalogo.html',contexto)

def nosotros(request):
    return render(request, 'nosotros.html')

def contacto(request):
    return render(request, 'contacto.html')

def login(request):
    return render(request, 'login.html')