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


// Contadores para los productos y los badges
let productContador = 0;
let badgeContador = 0;

// Elemento del DOM para el contador de productos
let productCountElement = document.querySelector('.btn-outline-primary .badge');

// Array para almacenar los productos agregados
let productosAgregados = [];

// Función para inicializar los productos desde el localStorage
function inicializarProductos() {
  // Recuperar los productos del localStorage o inicializar a un array vacío si no existen
  productosAgregados = localStorage.getItem('productosAgregados') ? JSON.parse(localStorage.getItem('productosAgregados')) : [];

  // Actualizar los contadores con la cantidad de cada producto
  productosAgregados.forEach(producto => {
    productContador += producto.cantidad;
    badgeContador += producto.cantidad;
  });

  // Actualizar el texto del contador de productos en el DOM
  productCountElement.textContent = badgeContador;
}

// Función para crear una tarjeta de producto
function createCard(producto) {
  // Crear un nuevo elemento div
  const newCard = document.createElement('div');

  // Asignar clases al div
  newCard.className = "producto m-2 d-flex flex-row align-items-center";

  // Asignar el HTML interno del div
  newCard.innerHTML = `
    <img class="card-img-top" src="${producto.imgSrc}" alt="Imagen de la tarjeta" style="width: 6rem; height: 7rem;">
    <div class="card-body d-flex justify-content-between flex-grow-1" style="padding: 1rem;">
      <div>
        <h5 class="card-title">${producto.title}</h5>
        <h6 class="price">${producto.priceString}</h6>
        <p class="cantidad">Cantidad: ${producto.cantidad}</p>
      </div>
      <div class="d-flex flex-column align-items-end">
        <button class="btn btn-primary mb-2 btn-incrementar" style="width:40px;">+</button>
        <button class="btn btn-danger btn-disminuir" style="width:40px;">-</button>
      </div>
    </div>
  `;

  // Devolver la nueva tarjeta
  return newCard;
}

// Función para eliminar el mensaje de carrito vacío
function eliminarMensajeCarritoVacio() {
  // Solo eliminar el mensaje si hay al menos un producto
  if(productContador >= 1){
    let mensajeVacio = document.getElementById("mensaje-vacio");
    if (mensajeVacio) mensajeVacio.remove();
  }
}

// Función para cargar los productos al DOM
function cargarProductos() {
  // Solo cargar los productos si hay al menos uno
  if (productosAgregados.length > 0) {
    eliminarMensajeCarritoVacio();
    productosAgregados.forEach(producto => {
      document.getElementById("productos-agregados").appendChild(createCard(producto));
    });
  }
}

// Función para actualizar el localStorage con los productos y contadores actuales
function actualizarLocalStorage() {
  localStorage.setItem('productContador', productContador);
  localStorage.setItem('productosAgregados', JSON.stringify(productosAgregados));
}

// Función para agregar un producto al carrito
function agregarProducto() {
  // Agregar un event listener a cada botón de agregar
  document.querySelectorAll(".btn-agregar").forEach(button => {
    button.addEventListener("click", function() {
      // Recuperar los datos del producto desde el DOM
      let card = this.parentElement.parentElement;
      let imgSrc = card.querySelector('.card-img-top').src;
      let title = card.querySelector('.card-title').textContent;
      let priceString = card.querySelector('.price').textContent;

      // Verificar si el producto ya existe en el carrito
      let productoExistente = productosAgregados.find(producto => producto.title === title);

      // Si el producto ya existe, incrementar su cantidad
      if (productoExistente) {
        productoExistente.cantidad++;
        let existingCard = Array.from(document.getElementById("productos-agregados").children).find(card => card.querySelector('.card-title').textContent === title);
        existingCard.querySelector('.cantidad').textContent = `Cantidad: ${productoExistente.cantidad}`;
      } else {
        // Si el producto no existe, crear uno nuevo y agregarlo al carrito
        let newProduct = { imgSrc, title, priceString, cantidad: 1 };
        productosAgregados.push(newProduct);
        document.getElementById("productos-agregados").appendChild(createCard(newProduct));
      }

      // Incrementar el contador de productos y actualizar el DOM y el localStorage
      productContador++;
      productCountElement.textContent = productContador;
      actualizarLocalStorage();

      // Eliminar el mensaje de carrito vacío si existe
      eliminarMensajeCarritoVacio();
    });
  });
}

// Función para manejar la cantidad de un producto en el carrito
function manejarCantidad() {
  // Agregar un event listener al contenedor de productos
  document.getElementById("productos-agregados").addEventListener("click", function(e) {
    // Recuperar la tarjeta del producto desde el DOM
    let card = e.target.closest('.producto');
    if (!card) return;

    // Recuperar la cantidad actual del producto
    let quantityElement = card.querySelector('.cantidad');
    let quantity = parseInt(quantityElement.textContent.split(': ')[1]);

    // Si se presionó el botón de incrementar, incrementar la cantidad del producto
    if (e.target.matches('.btn-incrementar')) {
      quantityElement.textContent = `Cantidad: ${quantity + 1}`;
      let index = productosAgregados.findIndex(producto => producto.title === card.querySelector('.card-title').textContent);
      productosAgregados[index].cantidad++;
      actualizarLocalStorage();
      productContador++;
      productCountElement.textContent = productContador;
    } else if (e.target.matches('.btn-disminuir')) {
      // Si se presionó el botón de disminuir, disminuir la cantidad del producto
      if (quantity > 1) {
        quantityElement.textContent = `Cantidad: ${quantity - 1}`;
        let index = productosAgregados.findIndex(producto => producto.title === card.querySelector('.card-title').textContent);
        productosAgregados[index].cantidad--;
        actualizarLocalStorage();
      } else {
        // Si la cantidad es 1, eliminar el producto del carrito
        card.remove();
        let index = productosAgregados.findIndex(producto => producto.title === card.querySelector('.card-title').textContent);
        productosAgregados.splice(index, 1);
        actualizarLocalStorage();
      }
      // Decrementar el contador de productos y actualizar el DOM y el localStorage
      productContador--;
      productCountElement.textContent = productContador;
      actualizarLocalStorage();
    }
  });
}

// Inicializar los productos y cargarlos al iniciar la página
inicializarProductos();
cargarProductos();

// Agregar los eventos de agregar producto y manejar cantidad
agregarProducto();
manejarCantidad();
