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




//Inicializamos un contador, este precisamente nos servirá
//para que no se nos rompa el offcanvas cuando agreguemos nuevos productos
let productContador = 0;



document.querySelectorAll(".btn-agregar").forEach(button => {
    button.addEventListener("click", function() {


        let card = this.parentElement.parentElement;
        let imgSrc = card.querySelector('.card-img-top').src;
        let title = card.querySelector('.card-title').textContent;
        let price = card.querySelector('.price').textContent;

        let newCardHTML = `
        <div class="producto m-2 d-flex flex-row">
            <img class="card-img-top" src="${imgSrc}" alt="Imagen de la tarjeta" style="width: 5rem;">
            <div class="card-body d-flex justify-content-between" style="padding: 1rem;">
        <div>
            <h5 class="card-title">${title}</h6>
            <h6 class="price">${price}</h6>
        <p class="cantidad">Cantidad: 1</p>
        </div>
            <div class="d-flex flex-column align-items-end">
                <button class="btn btn-primary mb-2">+</button>
                <button class="btn btn-danger">-</button>
            </div>
        </div>
        </div>
        `;

        document.getElementById("productos-agregados").innerHTML += newCardHTML;
       
        productContador++;
    
    //Eliminaremos los elementos innecesarios que tenemos en nuestro offcanvas
    //Elementos como "Tu carrito está vacío" o "Agrega productos a tu carrito"
    //Por esta razón ocuparemos el contador, elimina solo cuando es el primer producto, después no
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
  
  
  // Función que nos permitirá agregar o eliminar productos de nuestro carrito
  document.getElementById("productos-agregados").addEventListener("click", function(e) {
  
    if (e.target.matches('.btn-primary')) {

        let card = e.target.closest('.producto');
        let quantityElement = card.querySelector('.cantidad');
        let quantity = parseInt(quantityElement.textContent.split(': ')[1]);
        quantityElement.textContent = `Cantidad: ${quantity + 1}`;

      } else if (e.target.matches('.btn-danger')) {
        let card = e.target.closest('.producto');
        let quantityElement = card.querySelector('.cantidad');
        let quantity = parseInt(quantityElement.textContent.split(': ')[1]);
        let price = parseFloat(card.querySelector('.price').textContent);

            if (quantity > 1) {
                totalPrice -= price;
                document.getElementById('total-price').textContent = `Total: ${totalPrice}`;
                quantityElement.textContent = `Cantidad: ${quantity - 1}`;
          } else {
            totalPrice -= price;
            document.getElementById('total-price').textContent = `Total: ${totalPrice}`;
              card.remove();
          }
    }

  });