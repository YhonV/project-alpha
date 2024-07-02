document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#buscar-pro');
  const searchButton = document.querySelector('#btn-buscar');
  const categoriasCheckboxes = document.querySelectorAll('.Categorías input[type="checkbox"]');
  const precioMinInput = document.querySelector('input[placeholder="0"]');
  const precioMaxInput = document.querySelector('input[placeholder="999999"]');
  const aplicarBtn = document.querySelector('#btn-categorias');
  const sugerenciasDiv = document.querySelector('#sugerencias');

  searchInput.addEventListener('input', debounce(filterProducts, 300));
  searchButton.addEventListener('click', filterProducts);
  aplicarBtn.addEventListener('click', filterProducts);

  function filterProducts() {
      const searchText = searchInput.value;
      const categoriasSeleccionadas = Array.from(categoriasCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.parentNode.textContent.trim());
      const precioMin = precioMinInput.value;
      const precioMax = precioMaxInput.value;

      const params = new URLSearchParams();
      if (searchText) params.append('q', searchText);
      categoriasSeleccionadas.forEach(cat => params.append('categoria', cat));
      if (precioMin) params.append('precio_min', precioMin);
      if (precioMax) params.append('precio_max', precioMax);

      window.location.href = `${window.location.pathname}?${params.toString()}`;
  }


});

