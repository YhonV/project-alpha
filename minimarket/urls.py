from minimarket import views
from django.urls import path

urlpatterns = [
    path('',views.inicio),
    path('catalogo/', views.catalogo),
    path('nosotros/', views.nosotros),
    path('contacto/', views.contacto),
    path('login/', views.login),
]

    