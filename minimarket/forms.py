from django import forms


class RegistroForm(forms.Form):
    nombre = forms.CharField(max_length=200, required=True)
    email = forms.EmailField(max_length=100,required=True)
    password = forms.CharField(label='Contraseña',required=True,widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirmar contraseña',required=True,widget=forms.PasswordInput)
    #telefono = forms.IntegerField(required=True)
    direccion = forms.CharField(max_length=200, required=True)
    # comuna = forms.CharField(max_length=50, required=True)

class formContacto (forms.Form):
    
    OPCIONES = [
        (None, 'Seleccione Opción'),
        ('CONSULTA', 'Consulta'),
        ('RECLAMO', 'Reclamo'),
        ('SUGERENCIA', 'Sugerencia'),
        ('OTRO', 'Otro'),
    ]
    nombre = forms.CharField(max_length=50, required=True)
    apellido = forms.CharField(max_length=50, required=True)
    correo = forms.EmailField(max_length=100,required=True)
    tipo_solicitud = forms.ChoiceField(choices=OPCIONES, required=True, widget=forms.Select(attrs={'placeholder': 'Selecciona una opción'}))
    comentario = forms.CharField(max_length=300, widget=forms.TextInput(attrs={'class': 'tamaño-texto'}))
