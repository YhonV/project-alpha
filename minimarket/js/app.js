document.querySelectorAll(".btn-agregar").forEach(button => {
    button.addEventListener("click", function() {
        let card = this.parentElement.parentElement;
        let imgSrc = card.querySelector('.card-img-top').src;
        let title = card.querySelector('.card-title').textContent;
        let price = card.querySelector('.price').textContent;

        let newCardHTML = `
        <div class="card m-2 d-flex flex-row">
            <img class="card-img-top" src="${imgSrc}" alt="Card image cap" style="width: 5rem;">
            <div class="card-body" style="padding: 1rem;">
                <h5 class="card-title">${title}</h5>
                <h4 class="price">${price}</h4>
            </div>
        </div>
        `;

        document.getElementById("productos-agregados").innerHTML += newCardHTML;
    });
});