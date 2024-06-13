from minimarket import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.inicio,name='index'),
    path('catalogo/', views.catalogo),
    path('nosotros/', views.nosotros),
    path('contacto/', views.contacto),
    path('login/', views.login),
    path('creaCuenta/',views.creaCuenta, name='creaCuenta'),
    path('login',views.view_login,name='login')
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    