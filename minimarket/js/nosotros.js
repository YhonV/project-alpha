// CLAVE API GOOGLE: AIzaSyCRzMttEjK-7jt1hS9Q5pSlGgknH0Vx2rM
//Crear el contenedor para el mapa dentro del contenedor de la seccion nosotros
const ubicMapa = document.getElementById('sec-nosotros')
const divMapa = document.createElement('div')

divMapa.id = 'map';
//Agregar el contenedor del mapa a la sección nosotros
ubicMapa.appendChild(divMapa);

//Funcion para cargar la API Google Maps con promesa
function CargarAPI(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Función para inicializar el mapa
function iniciarMapa() {
    //Variable para la ubicacion inicial del mapa
    const ubicacionMapa = {
        center: { lat: -33.521405, lng: -70.769129 },
        zoom: 17
    };
    //variable para la ubicación del cliente (origen)
    const ubicCliente = { lat: -33.47272, lng: -70.769130 };
    
    const mapa = document.getElementById('map');
    const cssMapa = document.createElement('style');

// Creamos el CSS para el mapa
cssMapa.textContent = `
    #map {
        height: 400px;
        width: 100%;  
    }
`;

// Agrega el CSS al head del HTML
document.head.appendChild(cssMapa);
    //Condicion para validar que el mapa fue creado
    if (mapa) {
        const map = new google.maps.Map(mapa, ubicacionMapa);
        console.log('Mapa creado:', map);
        const ubicLocal = { lat: -33.521405, lng: -70.769129 };

        // Creamos el marcador del local y lo añadimos al mapa
        const marcador = new google.maps.Marker({
            position: ubicLocal,
            map: map,
            title: 'Mi Marcador'
        });
        // Creamos el marcador del cliente y lo añadimos al mapa
        const marcadorCliente = new google.maps.Marker({
            position: ubicCliente,
            map: map,
            title: "Destino",
          });

    // Crear un servicio para obtener direcciones utilizando la API de Google Maps
    //Asignamos la ruta a una variable 
    const obtenerDirecciones = new google.maps.DirectionsService();
    const ruta = new google.maps.DirectionsRenderer({map: map,});

  // Obtener la ruta entre las dos direcciones
  obtenerDirecciones.route({origin: ubicCliente,destination: ubicLocal,travelMode: google.maps.TravelMode.DRIVING},(respuesta, estado) => {
        //Si las coordenadas ingresadas estan correctas: Se establece la ruta
        if (estado === "OK") {
        ruta.setDirections(respuesta);
      } else {
        alert("No se pudo mostrar la ruta debido a: " + estado);
      }
    }
  );

    } else {
        console.error('No se encontró el elemento con el ID "map" en el DOM.');
    }
}

// Cargar la API de Google Maps y llamar a initMap una vez que esté cargada
CargarAPI('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRzMttEjK-7jt1hS9Q5pSlGgknH0Vx2rM&callback=iniciarMapa')
    .then(() => {
        console.log('API de Google Maps cargada exitosamente');
    })
    .catch(error => {
        console.error('Error al cargar la API de Google Maps:', error);
});