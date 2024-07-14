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
from django.db.models import Q
import json


# Create your views here.

def inicio(request):
    return render(request,'index.html')

def catalogo(request):
    productos = Producto.objects.all().order_by('id_producto')
    
    categorias = request.GET.getlist('categoria')
    if categorias:
        productos = productos.filter(nombre_categoria__nombre_categoria__in=categorias)
    
    precio_min = request.GET.get('precio_min')
    precio_max = request.GET.get('precio_max')
    if precio_min:
        productos = productos.filter(precio__gte=float(precio_min))
    if precio_max:
        productos = productos.filter(precio__lte=float(precio_max))
    
    query = request.GET.get('q')
    if query:
        productos = productos.filter(
            Q(nombre__icontains=query) | 
            Q(nombre_categoria__nombre_categoria__icontains=query)
        )
    
    paginator = Paginator(productos, 9)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    contexto = {
        'productos': page_obj,
        'categorias': Categoria.objects.all(),
    }
    
    if request.user.is_authenticated:
        contexto['usuario'] = {
            'email': request.user.email,
            'direccion': request.user.last_name, 
        }
        
    return render(request, 'catalogo.html', contexto)

def api_productos(request):
    query = request.GET.get('q', '')
    if len(query) < 2:
        return JsonResponse([], safe=False)
    
    productos = Producto.objects.filter(
        Q(nombre__icontains=query) | 
        Q(nombre_categoria__nombre_categoria__icontains=query)
    )[:5]
    
    data = [{
        'id': str(p.id_producto),  
        'nombre': p.nombre, 
        'categoria': p.nombre_categoria
    } for p in productos]
    
    return JsonResponse(data, safe=False)

def nosotros(request):
    return render(request, 'nosotros.html')

def contacto(request):
    if request.method == 'POST':
        form = formContacto(request.POST)
        if form.is_valid():
            contacto = formularioContacto(
                apellido=form.cleaned_data['apellido'],
                correo=form.cleaned_data['correo'],
                tipo_solicitud=form.cleaned_data['tipo_solicitud'],
                comentario=form.cleaned_data['comentario']
            )
            contacto.set_nombre(form.cleaned_data['nombre']) #Aca obtenemos y encriptamos el nombre ingresado en el formulario para registrarlo en la base de datos
            nombre_desencriptado = contacto.get_nombre()  #Aca desencriptamos el nombre 
            message = f"{nombre_desencriptado}, tu solicitud de contacto fue enviada con éxito." #Generamos un mensaje de respuesta para ser usado en el JSON
            #Generamos un JSON de respuesta para ser enviado al frontend
            response = {
                'status': 'success',
                'message': message,
                'redirect': reverse('index')
            }
            contacto.save()
            form = formContacto()
            return JsonResponse(response)
    else:
        form = formContacto()
        response = {
            'status': 'error',
            'message': 'Formulario invalido!'
        }
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
@login_required(login_url='/login')
def procesar_compra(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'Usuario no autenticado'})

        usuario_logueado = request.user
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
                cliente=usuario_logueado,
                email_cliente=usuario_logueado.email,
                direccion_cliente=usuario_logueado.last_name, 
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
    
    orden = request.GET.get('orden', 'id_producto')
    direccion = request.GET.get('direccion', 'asc')
    
    if direccion == 'desc':
        orden = f'-{orden}'
    
    productos = Producto.objects.all().order_by(orden) 
    categorias = Categoria.objects.all().order_by('nombre_categoria') 
    
    if request.method == 'PUT':
        data = json.loads(request.body)
        nombreNuevo = data.get('nombre') 
        nombre_categoria = data.get('nombre_categoria')
        precio = data.get('precio')
        stock = data.get('stock')
        
        
        if not all([nombreNuevo, nombre_categoria, precio, stock]):
            return JsonResponse({"success": False, "message": "No puede haber campos vacíos."})
        
        try:
            stock = int(stock)
        except ValueError:
            return JsonResponse({"success": False, "message": "Stock debe ser un número entero."})
        
        try:
            precio = float(precio)
        except ValueError:
            return JsonResponse({"success": False, "message": "Precio debe ser un número entero."}) 
        
        if Producto.objects.filter(nombre=nombreNuevo).exists():
            producto = Producto.objects.get(nombre=nombreNuevo)
            categoria_objeto = Categoria.objects.get(nombre_categoria=nombre_categoria)
            producto.nombre_categoria = categoria_objeto
            producto.precio = precio
            if producto.precio < 0:
                return JsonResponse({"success": False, "message": "Precio no puede ser negativo."})
            producto.stock = stock
            if producto.stock < 0:
                return JsonResponse({"success": False, "message": "Stock no puede ser negativo."})
            producto.save()
            return JsonResponse({"success": True, "message": "Producto actualizado correctamente."})
        else:
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
    
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        nombre_categoria = request.POST.get('nombre_categoria')
        precio = request.POST.get('precio')
        stock = request.POST.get('stock')
        imagen = request.FILES.get('imagen')

            # Validación de existencia del producto
        if Producto.objects.filter(nombre=nombre).exists():
            return JsonResponse({"success": False, "message": "No puedes agregar un producto cuyo nombre ya exista."})

        try:
            stock = int(stock)
        except ValueError:
            return JsonResponse({"success": False, "message": "Stock debe ser un número entero positivo."})

        try:
            precio = float(precio)
        except ValueError:
            return JsonResponse({"success": False, "message": "Precio debe ser un número positivo."})

        categoria_objeto = Categoria.objects.get(nombre_categoria=nombre_categoria)
        producto = Producto(
            nombre=nombre,
            nombre_categoria=categoria_objeto,
            precio=precio,
            stock=stock,
            imagen=imagen
        )
        if producto.precio < 0:
            return JsonResponse({"success": False, "message": "Precio no puede ser negativo."})
        
        if producto.stock < 0:
            return JsonResponse({"success": False, "message": "Stock no puede ser negativo."})
        producto.save()
        return JsonResponse({"success": True, "message": "Producto creado correctamente."})
    
    contexto = {'productos': productos, 'categorias': categorias}
    return render(request, 'inventario.html', contexto)
