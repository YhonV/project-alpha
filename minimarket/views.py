from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse


from .models import Producto
from django.core.paginator import Paginator
from django.contrib.auth import login,authenticate

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from minimarket.forms import RegistroForm
from django.views.decorators.csrf import csrf_exempt



# Create your views here.

def inicio(request):
    return render(request,'index.html')

# @csrf_exempt
# def agregar_al_carrito(request):
#     if request.method == 'POST':
#         product_id = request.POST.get('product_id')
#         return JsonResponse({'status': 'success'})

def catalogo(request):
    productos = Producto.objects.all().order_by('id_producto') 
    paginator = Paginator(productos, 6)  

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    contexto = {'productos': page_obj}
    return render(request, 'catalogo.html', contexto)

def nosotros(request):
    return render(request, 'nosotros.html')

def contacto(request):
    return render(request, 'contacto.html')

def creaCuenta(request):
    form = RegistroForm()

    if request.method == 'POST':
        form = RegistroForm(request.POST)

        if form.is_valid():
            usuario = form.cleaned_data.get('usuario')
            pass1 = form.cleaned_data.get('password')
            pass2 = form.cleaned_data.get('password2')

            if pass1 == pass2:
                if User.objects.filter(username=usuario).exists():
                    response = {
                        'status': 'error',
                        'message': 'El usuario ya está registrado!'
                    }
                else:
                    user = User.objects.create_user(username=usuario, email=usuario, password=pass1)
                    user.save()
                    response = {
                        'status': 'success',
                        'message': 'Registro exitoso!',
                        'redirect': reverse('login')
                    }
                    return JsonResponse(response)
            else:
                response = {
                    'status': 'error',
                    'message': 'Las contraseñas deben coincidir'
                }
        else:
            response = {
                'status': 'error',
                'message': 'Formulario inválido'
            }
        return JsonResponse(response)

    else:
        form = RegistroForm()

    return render(request, 'creaCuenta.html', {"form": form})

def view_login(request):
    if request.method == 'POST':
        usuario = request.POST.get('email')
        password = request.POST.get('password')

        if not usuario:
            return JsonResponse({'status': 'error', 'message': 'Debe ingresar un nombre de usuario'}, status=400)

        if not password:
            return JsonResponse({'status': 'error', 'message': 'Debe ingresar la contraseña'}, status=400)

        user = authenticate(request, username=usuario, password=password)
        if user is None:
            return JsonResponse({'status': 'error', 'message': 'Usuario o contraseña incorrecto'}, status=400)
        else:
            login(request, user)
            return JsonResponse({'status': 'success', 'redirect': reverse('index')})

    return render(request,'login.html')


    