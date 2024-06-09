from django.shortcuts import render
from .models import Producto
from django.core.paginator import Paginator
# Create your views here.

def inicio(request):
    return render(request,'index.html')

def catalogo(request):
    productos = Producto.objects.all()
    paginator = Paginator(productos, 6) 

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    contexto = {'productos': page_obj}  
    return render(request, 'catalogo.html', contexto)

def nosotros(request):
    return render(request, 'nosotros.html')

def contacto(request):
    return render(request, 'contacto.html')

def login(request):
    return render(request, 'login.html')