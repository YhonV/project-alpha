from django.shortcuts import render

# Create your views here.

def inicio(request):
    return render(request,'index.html')

def catalogo(request):
    return render(request, 'catalogo.html')

def nosotros(request):
    return render(request, 'nosotros.html')