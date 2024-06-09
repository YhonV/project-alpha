from django.shortcuts import render, redirect
from .models import Producto
from django.core.paginator import Paginator
from django.contrib.auth import login,authenticate

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from minimarket.forms import RegistroForm
from django.contrib import messages

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
 return render(request,'login.html')

def creaCuenta(request):

    form = RegistroForm()

    if request.method == 'POST':
        form = RegistroForm(request.POST)

        if form.is_valid():
            usuario = form.cleaned_data.get('usuario')
            pass1 = form.cleaned_data.get('password')
            pass2 = form.cleaned_data.get('password2')

            if pass1 == pass2:
                
                if User.objects.filter(username = usuario).all().exists():
                    messages.error(request,'El usuario ya esta registrado!')
                else:
                    user = User.objects.create_user(username = usuario, email= usuario,password = pass1)
                    user.save()
                    return redirect('login')

            else:
                messages.error(request,'Las contraseñas deben coincidir')


    else:
        form = RegistroForm()

    return render(request,'creaCuenta.html',{"form":form})


def view_login(request):
    if request.method == 'POST':
        usuario = request.POST.get('usuario')
        password = request.POST.get('password')

        if(len(usuario) < 1):
            messages.error(request,'Debe ingresar un nombre de usuario')

        if(len(password) < 1):
            messages.error(request,'Debe ingresar la contraseña')

        usuario = authenticate(username=usuario,password = password)
        if usuario is None:
            messages.error(request,'Usuario o contraseña incorrecto')
        else:
            login(request,usuario)
            return redirect('index')

    return render(request,'login.html')

    