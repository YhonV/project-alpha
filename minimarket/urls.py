from minimarket import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.inicio,name='index'),
    path('catalogo/', views.catalogo),
    path('nosotros/', views.nosotros),
    path('contacto/', views.contacto, name='contacto'),
    path('login/', views.view_login, name='login'),
    path('creaCuenta/',views.creaCuenta, name='creaCuenta'),
    path('logout/', views.exit , name= 'exit'),
    path('procesar_compra/', views.procesar_compra, name='procesar_compra'),
    path('inventario/', views.inventario, name='inventario'),
    path('api/productos', views.api_productos, name='api_productos'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    