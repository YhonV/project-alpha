var aplicarBtn = document.querySelector('#btn-categorias');
aplicarBtn.addEventListener('click', filtrarProductos);

function filtrarProductos() {
  const categoriasSeleccionadas = Array.from(document.querySelectorAll('.Categorías input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.parentNode.textContent.trim());
  
  console.log('Categorías seleccionadas:', categoriasSeleccionadas);
  
  const productos = Array.from(document.querySelectorAll('.row.justify-content-center.align-items-center > div'));
  console.log('Productos totales:', productos.length);
  
  const productosFiltrados = productos.filter(producto => {
    const categoria = producto.querySelector('.card-text').textContent.trim();
    console.log('Categoría del producto:', categoria);
    return categoriasSeleccionadas.includes(categoria) || categoriasSeleccionadas.length === 0;
  });
  
  console.log('Productos filtrados:', productosFiltrados.length);
  
  productos.forEach(producto => producto.style.display = 'none');
  productosFiltrados.forEach(producto => producto.style.display = 'block');
}
//------------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#buscar-pro');
  const searchButton = document.querySelector('#btn-buscar');

  searchButton.addEventListener('click', filterProducts);

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card.m-2');

    cards.forEach(card => {
      const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();

      if (cardTitle.includes(searchText)) {
        card.style.display = 'block'; // Muestra la tarjeta
      } else {
        card.style.display = 'none'; // Oculta la tarjeta
      }
    });
  }
});
//------------------------------------------------------------------------------------------------------------------------