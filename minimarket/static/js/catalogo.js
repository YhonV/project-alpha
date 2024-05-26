// Código de filtrado de productos por categoría
// Selecciona el botón de aplicar filtros de categoría
const aplicarBtn = document.querySelector('#btn-categorias');
// Añade un evento 'click' al botón que llama a la función filtrarProductos
aplicarBtn.addEventListener('click', filtrarProductos);

function filtrarProductos() {
  // Obtiene todas las categorías seleccionadas (checkboxes marcados) y extrae sus textos
  const categoriasSeleccionadas = Array.from(document.querySelectorAll('.Categorías input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.parentNode.textContent.trim());
  
  // Muestra en la consola las categorías seleccionadas
  console.log('Categorías seleccionadas:', categoriasSeleccionadas);
  
  // Selecciona todos los productos
  const productos = Array.from(document.querySelectorAll('.row.justify-content-center.align-items-center > div'));
  // Muestra en la consola el número total de productos
  console.log('Productos totales:', productos.length);
  
  // Filtra los productos según las categorías seleccionadas
  const productosFiltrados = productos.filter(producto => {
    // Obtiene la categoría del producto desde el texto del elemento con clase 'card-text'
    const categoria = producto.querySelector('.card-text').textContent.trim();
    // Muestra en la consola la categoría del producto actual
    console.log('Categoría del producto:', categoria);
    // Incluye el producto si su categoría está en las seleccionadas o si no hay categorías seleccionadas
    return categoriasSeleccionadas.includes(categoria) || categoriasSeleccionadas.length === 0;
  });
  
  // Muestra en la consola el número de productos filtrados
  console.log('Productos filtrados:', productosFiltrados.length);
  
  // Oculta todos los productos
  productos.forEach(producto => producto.style.display = 'none');
  // Muestra solo los productos que pasaron el filtro
  productosFiltrados.forEach(producto => producto.style.display = 'block');
}
//------------------------------------------------------------------------------------------------------------------------

// Código de filtrado de productos por buscador
// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {
  // Selecciona el campo de entrada de búsqueda
  const searchInput = document.querySelector('#buscar-pro');
  // Selecciona el botón de búsqueda
  const searchButton = document.querySelector('#btn-buscar');

  // Agrega un evento 'click' al botón de búsqueda que llama a la función filterProducts
  searchButton.addEventListener('click', filterProducts);

  // Define la función para filtrar productos
  function filterProducts() {
    // Obtiene el texto ingresado en el campo de búsqueda y lo convierte a minúsculas
    const searchText = searchInput.value.toLowerCase();
    // Selecciona todas las tarjetas de producto
    const cards = document.querySelectorAll('.card.m-2');

    // Itera sobre cada tarjeta de producto
    cards.forEach(card => {
      // Obtiene el título de la tarjeta y lo convierte a minúsculas
      const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();

      // Muestra u oculta la tarjeta según si el título contiene el texto de búsqueda
      if (cardTitle.includes(searchText)) {
        card.style.display = 'block'; // Muestra la tarjeta
      } else {
        card.style.display = 'none'; // Oculta la tarjeta
      }
    });
  }
});
//------------------------------------------------------------------------------------------------------------------------