from django.contrib import admin
from django.urls import path

from minimarket import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.inicio),
    path('catalogo/', views.catalogo),
    path('nosotros/', views.nosotros),
    path('contacto/', views.contacto),
]
