var aplicarBtn = document.querySelector('#btn-aplicar');
aplicarBtn.addEventListener('click', filtrarProductos);

function filtrarProductos() {
  const categoriasSeleccionadas = Array.from(document.querySelectorAll('.Categorías input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.parentNode.textContent.trim());
  
  const precioMin = document.getElementById('precio_min').value;
  const precioMax = document.getElementById('precio_max').value;

  const url = new URL(window.location.href);
  // Condicion para asignar parametros de busqueda a la URL dependiendo del resultado de la categoria seleccionada sino se selecciona ninguna categoria se elimina el filtro
  if (categoriasSeleccionadas.length > 0) {
    url.searchParams.set('categoria', categoriasSeleccionadas.join(','));
  } else {
    url.searchParams.delete('categoria');
  }
  // Condicion para asignar parametros de busqueda a la URL dependiendo del valor ingresado en el filtro precio minimo sino se ingresa ningun monto se elimina el filtro
  if (precioMin) {
    url.searchParams.set('precio_min', precioMin);
  } else {
    url.searchParams.delete('precio_min');
  }
  // Condicion para asignar parametros de busqueda a la URL dependiendo del valor ingresado en el filtro precio maximo sino se ingresa ningun monto se elimina el filtro
  if (precioMax) {
    url.searchParams.set('precio_max', precioMax);
  } else {
    url.searchParams.delete('precio_max');
  }

  window.location.href = url.toString();
}