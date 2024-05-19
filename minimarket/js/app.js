// Código de filtrado de productos por categoría
const aplicarBtn = document.querySelector('#btn-categorias');
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


/**
 * Inicializamos variable contador
 * y elemento que muestra el contador
 */
let productContador = 0;
let productCountElement = document.querySelector('.btn-outline-primary .badge');


/**
 * Creamos la funcion de agregar un producto al carro
 * Extraemos datos de la tarjeta del producto
 * Creamos una nueva tarjeta con la información extraida
 * y la agregamos al offcanvas
*/
document.querySelectorAll(".btn-agregar").forEach(button => {
  button.addEventListener("click", function() {

    /**
     * Extraemos toda la información necesaria de la tarjeta del producto
     */
    let card = this.parentElement.parentElement;
    let imgSrc = card.querySelector('.card-img-top').src;
    let title = card.querySelector('.card-title').textContent;
    let priceString = card.querySelector('.price').textContent;
    let price = parseFloat(priceString.replace('$', ''));


    /**
     * Creamos una nueva tarjeta con la información extraida
     * y la agregamos al offcanvas
     * Además de incrementar el contador de productos
     */
    let newCardHTML = `
      <div class="producto m-2 d-flex flex-row">
        <img class="card-img-top" src="${imgSrc}" alt="Imagen de la tarjeta" style="width: 6rem; height: 7rem;">
        <div class="card-body d-flex justify-content-between" style="padding: 1rem;">
          <div>
            <h5 class="card-title">${title}</h5>
            <h6 class="price">${priceString}</h6>
            <p class="cantidad">Cantidad: 1</p>
            <h6 class="total">Total: $${price.toFixed(2)}</h6>
          </div>
          <div class="d-flex flex-column align-items-end">
            <button class="btn btn-primary mb-2" style="width:40px;">+</button>
            <button class="btn btn-danger" style="width:40px;">-</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("productos-agregados").innerHTML += newCardHTML;
    productContador++;
    productCountElement.textContent = productContador;


    /**
     * Si es el primer producto agregado
     * eliminamos el mensaje de carro vacío
     */
    if(productContador == 1) {
      let offcanvasBody = document.getElementById("productos-agregados");
      let h5 = offcanvasBody.querySelector("h5");
      let p = offcanvasBody.querySelector("p");
      let b = offcanvasBody.querySelector("button");
      let im = offcanvasBody.querySelector("img");
      if (h5) h5.remove();
      if (p) p.remove();
      if (b) b.remove();
      if (im) im.remove();
    }
  });
});


/**
 * Creamos una función para incrementar y decrementar la cantidad de productos
 * 
 */
document.getElementById("productos-agregados").addEventListener("click", function(e) {

  /**
   * Si e.target es igual a .btn-primary
   * asignamos card con el elemento más cercano con la clase .producto(busca el contenedor que fue clickeado)
   * asignamos quantityElement con el elemento que contiene la cantidad
   * asignamos quantity con el valor de la cantidad
   * incrementamos la cantidad
   * actualizamos el contador de productos junto con el elemento que lo muestra
   */
  if (e.target.matches('.btn-primary')) {

    let card = e.target.closest('.producto');
    let quantityElement = card.querySelector('.cantidad');
    let quantity = parseInt(quantityElement.textContent.split(': ')[1]);
    quantityElement.textContent = `Cantidad: ${quantity + 1}`;
    productContador++;
    productCountElement.textContent = productContador;


    /**
     * Extraemos el precio del producto (precio en String)
     * Convertimos el precio a un número flotante reemplazando el signo de dolar
     * Lo multiplicamos por la cantidad + 1
     * Creamos un elemento totalElement que contiene el precio total
     * Si el elemento total no existe, lo creamos
     * y lo agregamos al contenedor de la tarjeta 
    */
    let priceString = card.querySelector('.price').textContent;
    let price = parseFloat(priceString.replace('$', ''));
    let total = price * (quantity + 1);
    let totalElement = card.querySelector('.total') || document.createElement('h6');
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    totalElement.classList.add('total');
    card.querySelector('.card-body').appendChild(totalElement);


    /**
     * En caso de que el target sea igual a .btn-danger
     * Realizamos el mismo proceso que en el caso anterior
     * Pero decrementando la cantidad en vez de incrementar
     */
  } else if (e.target.matches('.btn-danger')) {

    let card = e.target.closest('.producto');
    let quantityElement = card.querySelector('.cantidad');
    let quantity = parseInt(quantityElement.textContent.split(': ')[1]);
    productContador--;
    productCountElement.textContent = productContador;
    

    /**
     * Si la cantidad es mayor a 1
     * decrementamos la cantidad
     * volvemos a calcular el precio total
     * y actualizamos el elemento total
     */
    if (quantity > 1) {
      quantityElement.textContent = `Cantidad: ${quantity - 1}`;

      let priceString = card.querySelector('.price').textContent;
      let price = parseFloat(priceString.replace('$', ''));
      let total = price * (quantity - 1);
      let totalElement = card.querySelector('.total');
      totalElement.textContent = `Total: $${total.toFixed(2)}`;

      /**
       * En caso contrario
       * eliminamos la tarjeta del producto
       * y si el contador de productos es igual a 0
       * mostramos un mensaje de carro vacío
       */
    } else {
      card.remove();
      if (productContador === 0) {
        let offcanvasBody = document.getElementById("productos-agregados");
        offcanvasBody.innerHTML = `
          <img src="https://cdn-icons-png.flaticon.com/512/102/102661.png" style="width: 100px; height: 100px;" alt="">
          <h5>Tu carro esta vacío</h5><br>
          <p>¡Descubre los productos que tenemos para ti!</p>
          <button type="button" class="btn btn-primary">
            <a href="catalogo.html" id="txtAgreProd" style=" font-weight: bold; ">Agregar Productos</a>
          </button>
        `;
      }
    }
  }
});

