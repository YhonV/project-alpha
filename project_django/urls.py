from django.contrib import admin
from django.urls import path

from minimarket import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.index),
    path('catalogo/', views.catalogo)
]