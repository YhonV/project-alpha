from django import forms


class RegistroForm(forms.Form):
    usuario = forms.EmailField(max_length=64,required=True)
    password = forms.CharField(label='Contraseña',required=True,widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirmar contraseña',required=True,widget=forms.PasswordInput)