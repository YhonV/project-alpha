let productContador = 0;

document.querySelectorAll(".btn-agregar").forEach(button => {
    button.addEventListener("click", function() {


        let card = this.parentElement.parentElement;
        let imgSrc = card.querySelector('.card-img-top').src;
        let title = card.querySelector('.card-title').textContent;
        let price = card.querySelector('.price').textContent;

        let newCardHTML = `
        <div class="producto m-2 d-flex flex-row">
        <img class="card-img-top" src="${imgSrc}" alt="Card image cap" style="width: 5rem;">
        <div class="card-body d-flex justify-content-between" style="padding: 1rem;">
    <div>
        <h5 class="card-title">${title}</h5>
        <h4 class="price">${price}</h4>
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

        // Busca el elemento más cercano con la clase 'producto'
        let card = e.target.closest('.producto');

        // Dentro de la tarjeta del producto, busca el elemento con la clase 'cantidad'
        let quantityElement = card.querySelector('.cantidad');

        // Obtiene el texto del elemento 'cantidad', lo divide por ': ', toma el segundo elemento del array resultante y lo convierte a un número entero
        let quantity = parseInt(quantityElement.textContent.split(': ')[1]);

        // Incrementa la cantidad en 1 y actualiza el texto del elemento 'cantidad'
        quantityElement.textContent = `Cantidad: ${quantity + 1}`;

      } else if (e.target.matches('.btn-danger')) {
        let card = e.target.closest('.producto');
        let quantityElement = card.querySelector('.cantidad');
        let quantity = parseInt(quantityElement.textContent.split(': ')[1]);

        //Si la cantidad es mayor a 1, se le resta 1 a la cantidad
        //De lo contrario, remueve la tarjeta del producto
            if (quantity > 1) {
              quantityElement.textContent = `Cantidad: ${quantity - 1}`;
          } else {
              card.remove();
          }
      }
  });