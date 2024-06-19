# Generated by Django 5.0.6 on 2024-06-19 02:16

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('minimarket', '0005_alter_producto_imagen'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id_cliente', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('nombre_completo', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=254)),
                ('direccion', models.CharField(max_length=100)),
                ('telefono', models.CharField(max_length=100)),
            ],
        ),
        migrations.AlterField(
            model_name='producto',
            name='imagen',
            field=models.ImageField(null=True, upload_to='productos/'),
        ),
        migrations.CreateModel(
            name='detalleCompra',
            fields=[
                ('id_detalle', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField()),
                ('total', models.FloatField()),
                ('id_producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='minimarket.producto')),
            ],
        ),
    ]