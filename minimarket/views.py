from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse


from .models import Producto, formularioContacto,detalleCompra, Categoria
from django.core.paginator import Paginator
from django.contrib.auth import login,authenticate
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from minimarket.forms import RegistroForm, formContacto
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.

def inicio(request):
    return render(request,'index.html')

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
    if request.method == 'POST':
        form = formContacto(request.POST)
        if form.is_valid():
            contacto = formularioContacto(
                nombre=form.cleaned_data['nombre'],
                apellido=form.cleaned_data['apellido'],
                correo=form.cleaned_data['correo'],
                tipo_solicitud=form.cleaned_data['tipo_solicitud'],
                comentario=form.cleaned_data['comentario']
            )
            contacto.save()
            form = formContacto()
            return redirect('/?enviado=true')
    else:
        form = formContacto()

    return render(request, 'contacto.html', {'form': form})

def creaCuenta(request):
    form = RegistroForm()

    if request.method == 'POST':
        form = RegistroForm(request.POST)

        if form.is_valid():
            usuario = form.cleaned_data.get('email')
            pass1 = form.cleaned_data.get('password')
            pass2 = form.cleaned_data.get('password2')
            nombre = form.cleaned_data.get('nombre')
            telefono = form.cleaned_data.get('telefono')
            direccion = form.cleaned_data.get('direccion')

            if pass1 == pass2:
                if User.objects.filter(username=usuario).exists():
                    response = {
                        'status': 'error',
                        'message': 'El usuario ya está registrado!'
                    }
                else:
                    user = User.objects.create_user(username=usuario, 
                                                    email=usuario, 
                                                    password=pass1,
                                                    first_name=nombre,
                                                    last_name=direccion)
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

    return render(request,'registration/login.html')

def exit(request):
    logout(request)
    return redirect('index')

@csrf_exempt
@transaction.atomic
def procesar_compra(request):
    if request.method == 'POST':
        nombres_productos = request.POST.getlist('nombresProductos[]')
        cantidades = request.POST.getlist('cantidades[]')
        total = float(request.POST.get('total'))
        detalles_compra = []
        
        for nombre_producto, cantidad in zip(nombres_productos, cantidades):
            cantidad = int(cantidad)
            try:
                producto = Producto.objects.get(nombre=nombre_producto)
            except Producto.DoesNotExist:
                return JsonResponse({'success': False, 'message': f'Producto no encontrado: {nombre_producto}'})
            
            if producto.stock < cantidad:
                return JsonResponse({'success': False, 'message': f'Stock insuficiente para {nombre_producto}'})
            
            producto.stock -= cantidad
            producto.save()
            
            detalle = detalleCompra(
                id_producto=producto,
                cantidad=cantidad,
                total=producto.precio * cantidad
            )
            detalles_compra.append(detalle)
        
        detalleCompra.objects.bulk_create(detalles_compra)
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'})

@csrf_exempt
@transaction.atomic
def inventario(request):
    productos = Producto.objects.all().order_by('id_producto') 
    
    if request.method == 'POST':
        data = json.loads(request.body)
        nombreNuevo = data.get('nombre') 
        nombre_categoria = data.get('nombre_categoria')
        precio = data.get('precio')
        stock = data.get('stock')
        imagen = data.get('imagen')
        
        # Verificar si el producto existe
        if Producto.objects.filter(nombre=nombreNuevo).exists():
            producto = Producto.objects.get(nombre=nombreNuevo)
            categoria_objeto = Categoria.objects.get(nombre_categoria=nombre_categoria)
            producto.nombre_categoria = categoria_objeto
            producto.precio = precio
            producto.stock = stock
            producto.imagen = imagen
            producto.save()
            return JsonResponse({"success": True, "message": "Producto actualizado correctamente."})
        else:
            # Manejar el caso en que el producto no existe
            return JsonResponse({"success": False, "message": "Producto no encontrado."})
    
    if request.method == 'DELETE':
        print("Cuerpo de la solicitud:", request.body)
        data = json.loads(request.body)
        print("Datos decodificados:", data)
        nombre = data.get('nombre') 
        try:
            producto = Producto.objects.get(nombre=nombre)
            producto.delete()
            return JsonResponse({"success": True, "message": "Producto eliminado correctamente."})
        except Producto.DoesNotExist:
            return JsonResponse({"success": False, "message": "Producto no encontrado."})
    
    contexto = {'productos': productos}
    return render(request, 'inventario.html', contexto)