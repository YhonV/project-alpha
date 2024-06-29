let productContador = 0;
let badgeContador = 0;
let productCountElement = document.querySelector('.btn-outline-primary .badge');
let productosAgregados = [];
let precioTotal = 0;
let totalCarritoElement = document.getElementById('precio-total-carrito');

// Inicialización de productos desde localStorage y actualización de la UI
function inicializarProductos() {
  productosAgregados = localStorage.getItem('productosAgregados') ? JSON.parse(localStorage.getItem('productosAgregados')) : [];
  productosAgregados.forEach(producto => {
    productContador += producto.cantidad;
    badgeContador += producto.cantidad;
  });
  productCountElement.textContent = badgeContador;
  agregarBotonCompra();
}

// Creación de la tarjeta de producto
function createCard(producto) {
  const newCard = document.createElement('div');
  newCard.className = "producto m-2 d-flex flex-row align-items-center";
  newCard.innerHTML = `
    <img class="card-img-top" src="${producto.imgSrc}" alt="Imagen de la tarjeta" style="width: 6rem; height: 7rem;">
    <div class="card-body d-flex justify-content-between flex-grow-1" style="padding: 1rem;">
      <div>
        <h5 class="card-title">${producto.title}</h5>
        <h6 class="price $">${producto.priceString}</h6>
        <p class="cantidad">Cantidad: ${producto.cantidad}</p>
      </div>
      <div class="d-flex flex-column align-items-end">
        <button class="btn btn-primary mb-2 btn-incrementar" style="width:40px;">+</button>
        <button class="btn btn-danger btn-disminuir" style="width:40px;">-</button>
      </div>
    </div>
  `;
  return newCard;
}

// Agregar producto al carrito
function agregarProducto() {
  document.querySelectorAll(".btn-agregar").forEach(button => {
    button.addEventListener("click", function() {
      let card = this.closest(".card");
      if (!card) return console.error("No se pudo encontrar la tarjeta asociada con el botón.");
      
      let imgSrc = card.querySelector('.card-img-top').src;
      let title = card.querySelector('.card-title').textContent;
      let priceString = card.querySelector('.price').textContent;
      let price = parseFloat(priceString.replace('$', ''));
      
      let id_producto = card.getAttribute('data-id');
      let productoExistente = productosAgregados.find(producto => producto.title === title);

      if (productoExistente) {
        productoExistente.cantidad++;
        actualizarProductoEnUI(title, productoExistente.cantidad);
      } else {
        let newProduct = { id_producto, imgSrc, title, priceString: '$' + priceString, cantidad: 1, price };
        productosAgregados.push(newProduct);
        document.getElementById("productos-agregados").appendChild(createCard(newProduct));
      }

      actualizarContadoresYTotal();
    });
  });
}

// Actualizar producto en la UI
function actualizarProductoEnUI(title, cantidad) {
  let existingCard = Array.from(document.getElementById("productos-agregados").children)
                          .find(card => card.querySelector('.card-title').textContent === title);
  if (existingCard) {
    existingCard.querySelector('.cantidad').textContent = `Cantidad: ${cantidad}`;
  }
}

// Actualizar contadores y total
function actualizarContadoresYTotal() {
  productContador = 0;
  badgeContador = 0;
  productosAgregados.forEach(producto => {
    productContador += producto.cantidad;
    badgeContador += producto.cantidad;
  });
  productCountElement.textContent = badgeContador;
  totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
  actualizarLocalStorage();
  agregarBotonCompra();
  eliminarMensajeCarritoVacio();
}

// Eliminar mensaje de carrito vacío
function eliminarMensajeCarritoVacio() {
  if(productContador >= 1){
    let mensajeVacio = document.getElementById("mensaje-vacio");
    if (mensajeVacio) mensajeVacio.remove();
  }
}

// Cargar productos al iniciar
function cargarProductos() {
  if (productosAgregados.length > 0) {
    eliminarMensajeCarritoVacio();
    productosAgregados.forEach(producto => {
      document.getElementById("productos-agregados").appendChild(createCard(producto));
    });
    totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
  }
}

// Actualizar localStorage
function actualizarLocalStorage() {
  localStorage.setItem('productosAgregados', JSON.stringify(productosAgregados));
}

// Manejar cantidad de productos
function manejarCantidad() {
  document.getElementById("productos-agregados").addEventListener("click", function(e) {
    let card = e.target.closest('.producto');
    if (!card) return;

    let title = card.querySelector('.card-title').textContent;
    let index = productosAgregados.findIndex(producto => producto.title === title);
    if (index === -1) return;

    if (e.target.matches('.btn-incrementar')) {
      productosAgregados[index].cantidad++;
      actualizarProductoEnUI(title, productosAgregados[index].cantidad); // Asegúrate de actualizar la UI con la nueva cantidad
    } else if (e.target.matches('.btn-disminuir')) {
      productosAgregados[index].cantidad--;
      if (productosAgregados[index].cantidad === 0) {
        productosAgregados.splice(index, 1);
        card.remove(); // Elimina la tarjeta del producto si la cantidad es 0
      } else {
        actualizarProductoEnUI(title, productosAgregados[index].cantidad); // Actualiza la UI si la cantidad no es 0
      }
    }

    actualizarContadoresYTotal();
  });
}

// Calcular total del carrito
function calcularTotal() {
  return productosAgregados.reduce((total, producto) => total + producto.price * producto.cantidad, 0);
}

// Agregar botón de compra si hay productos
function agregarBotonCompra() {
  const botonCompraDiv = document.getElementById('boton-comprar');
  if (productContador > 0 && !botonCompraDiv.children.length) {
    const botonCompra = document.createElement('button');
    botonCompra.type = 'button';
    botonCompra.classList.add('btn', 'btn-primary');
    botonCompra.id = 'comprar';
    botonCompra.textContent = 'Comprar';
    botonCompra.style.marginTop = '10px'; // Agregado margen superior de 10px
    botonCompraDiv.appendChild(botonCompra);
  }
}


document.getElementById('boton-comprar').addEventListener('click', function() {
  const nombresProductos = productosAgregados.map(p => encodeURIComponent(p.title));
  const cantidades = productosAgregados.map(p => p.cantidad);
  const total = calcularTotal();
  const csrftoken = getCookie('csrftoken');

  fetch('/procesar_compra/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrftoken
    },
    body: `nombresProductos[]=${nombresProductos.join('&nombresProductos[]=')}&cantidades[]=${cantidades.join('&cantidades[]=')}&total=${total}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Mostrar el modal de compra exitosa
      var myModal = new bootstrap.Modal(document.getElementById('modalCompraExitosa'), {
        keyboard: false
      });
      myModal.show();

      // Vaciar el carrito
      productosAgregados = [];
      actualizarContadoresYTotal();
      document.getElementById("productos-agregados").innerHTML = '';
    } else {
      // Mostrar el mensaje de error con SweetAlert2
      if (data.message && data.message.includes('Stock insuficiente')) {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: data.message
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al procesar la compra'
        });
      }
    }
  })
  .catch((error) => {
    // Capturar errores que puedan ocurrir durante la solicitud
    console.error('Error en la solicitud:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error inesperado, por favor intente nuevamente.'
    });
  });
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

// Inicialización
inicializarProductos();
cargarProductos();
agregarProducto();
manejarCantidad();