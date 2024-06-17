let productContador = 0;
let badgeContador = 0;
let productCountElement = document.querySelector('.btn-outline-primary .badge');
let productosAgregados = [];
let precioTotal = 0;
let totalCarritoElement = document.getElementById('precio-total-carrito');

function inicializarProductos() {
  productosAgregados = localStorage.getItem('productosAgregados') ? JSON.parse(localStorage.getItem('productosAgregados')) : [];
  productosAgregados.forEach(producto => {
    productContador += producto.cantidad;
    badgeContador += producto.cantidad;
  });

  productCountElement.textContent = badgeContador;
}

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

function agregarProducto() {
  document.querySelectorAll(".btn-agregar").forEach(button => {
    button.addEventListener("click", function() {
      let card = this.closest(".card");

      if (!card) {
        console.error("No se pudo encontrar la tarjeta asociada con el botón.");
        return;
      }
      let productId = card.dataset.productId;
      let imgElement = card.querySelector('.card-img-top');
      if (!imgElement) {
        console.error("No se encontró el elemento de imagen en la tarjeta del producto.");
        return;
    }
      let titleElement = card.querySelector('.card-title');
      let priceElement = card.querySelector('.price');

      if (!imgElement || !titleElement || !priceElement) {
        console.error("Faltan elementos en la tarjeta del producto.");
        return;
      }

      let imgSrc = imgElement.src;
      let title = titleElement.textContent;
      let priceString = priceElement.textContent;
      let price = parseFloat(priceString.replace('$', ''));
      let productoExistente = productosAgregados.find(producto => producto.title === title);

      if (productoExistente) {
        productoExistente.cantidad++;
        let existingCard = Array.from(document.getElementById("productos-agregados").children)
                                .find(card => card.querySelector('.card-title').textContent === title);
        if (existingCard) {
          existingCard.querySelector('.cantidad').textContent = `Cantidad: ${productoExistente.cantidad}`;
        }
      } else {
        let newProduct = { imgSrc, title, priceString: '$' + priceString, cantidad: 1, price };
        productosAgregados.push(newProduct);
        document.getElementById("productos-agregados").appendChild(createCard(newProduct));
        totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
      }

      productContador++;
      productCountElement.textContent = productContador;
      totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
      actualizarLocalStorage();

      eliminarMensajeCarritoVacio();

      // $.ajax({
      //   type: 'POST',
      //   url: '/agregar-al-carrito/',
      //   data: {
      //     'product_id': productId,
      //     'csrfmiddlewaretoken': CSRF_TOKEN  
      //   },
      //   success: function(response) {
      //   }
      // });
    });
  });
}

function eliminarMensajeCarritoVacio() {
  if(productContador >= 1){
    let mensajeVacio = document.getElementById("mensaje-vacio");
    if (mensajeVacio) mensajeVacio.remove();
  }
}

function cargarProductos() {
  // Solo cargar los productos si hay al menos uno
  if (productosAgregados.length > 0) {
    eliminarMensajeCarritoVacio();
    productosAgregados.forEach(producto => {
      document.getElementById("productos-agregados").appendChild(createCard(producto));
    });
    totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
  }
}

function actualizarLocalStorage() {
  localStorage.setItem('productContador', productContador);
  localStorage.setItem('productosAgregados', JSON.stringify(productosAgregados));
}

function manejarCantidad() {
  document.getElementById("productos-agregados").addEventListener("click", function(e) {
    let card = e.target.closest('.producto');
    if (!card) return;

    let quantityElement = card.querySelector('.cantidad');
    let quantity = parseInt(quantityElement.textContent.split(': ')[1]);
    let priceElement = card.querySelector('.price');
    let price = parseFloat(priceElement.textContent.replace('$', ''));

    if (e.target.matches('.btn-incrementar')) {
      quantityElement.textContent = `Cantidad: ${quantity + 1}`;
      let index = productosAgregados.findIndex(producto => producto.title === card.querySelector('.card-title').textContent);
      productosAgregados[index].cantidad++;
      actualizarLocalStorage();
      productContador++;
      productCountElement.textContent = productContador;
      totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
    } else if (e.target.matches('.btn-disminuir')) {
      if (quantity > 1) {
        quantityElement.textContent = `Cantidad: ${quantity - 1}`;
        let index = productosAgregados.findIndex(producto => producto.title === card.querySelector('.card-title').textContent);
        productosAgregados[index].cantidad--;
        actualizarLocalStorage();
        totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
      } else {
        card.remove();
        let index = productosAgregados.findIndex(producto => producto.title === card.querySelector('.card-title').textContent);
        productosAgregados.splice(index, 1);
        actualizarLocalStorage();

        if (productosAgregados.length === 0) {
          productContador = 0;
          productCountElement.textContent = productContador;
          totalCarritoElement.textContent = 'Tu precio total es de: $0';
        } else {
          productContador--;
          productCountElement.textContent = productContador;
        }
      }
      totalCarritoElement.textContent = `Tu precio total es de: $${calcularTotal()}`;
      actualizarLocalStorage();
    }
  });
}

function calcularTotal() {
  let total = 0;
  productosAgregados.forEach(producto => {
    total += producto.price * producto.cantidad;
  });
  return total;
}

inicializarProductos();
cargarProductos();
agregarProducto();
manejarCantidad();