// CLAVE API GOOGLE: AIzaSyCRzMttEjK-7jt1hS9Q5pSlGgknH0Vx2rM
//Crear el contenedor para el mapa dentro del contenedor de la seccion nosotros
const ubicMapa = document.getElementById('sec-nosotros')
const divMapa = document.createElement('div')

divMapa.id = 'map';

//Agregar el contenedor del mapa a la sección nosotros
ubicMapa.appendChild(divMapa);
//Declaramos una variable global para poder utilizar las coordenadas en donde sea requerido
let coordenadasGlobales=null;

//Funcion para cargar la API Google Maps con promesa
async function cargarAPI(url) {
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

// Funcion para obtener coordenadas a traves de API de Google Maps: Geocoding API
// En caso de ingresar una dirección valida calculara las coordenadas, en caso contrario devolvera una alerta informando el error
async function obtenerCoordenadas(direccion) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': direccion }, (resultados, estado) => {
            if (estado === 'OK') {
                const coordenadas = resultados[0].geometry.location;
                resolve(coordenadas);
            } else {
                alert('No se pudieron obetener las coordenadas, por favor ingrese una dirección valida')
                
            }
        });
    });
}

// Manejar el envío del formulario para obtener la dirección y calcular las coordenadas
document.getElementById('direccion-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    //Obetenemos la dirección desde el input de la dirección y lo asignamos a una variable
    const direccionCliente = document.getElementById('direccion-input').value;
    try {
        const coordenadas = await obtenerCoordenadas(direccionCliente);
        console.log('Coordenadas obtenidas:', coordenadas.toString);
        // Creamos un objeto en una variable global y asignamos por separado los valores latitud y longitud 
        coordenadasGlobales = {
            lat: coordenadas.lat(),
            lng: coordenadas.lng()
        };
        //Mostramos por consola el valor de la latitud y longitud para validar los datos
        console.log('Latitud:', coordenadasGlobales.lat);
        console.log('Longitud:', coordenadasGlobales.lng);
    // Llamamos a la funcion iniciar mapa utilizando como parametro el objeto coordenadas globales
        iniciarMapa(coordenadasGlobales);
    } catch (error) {
        console.error(error);
    }
});

// Función para inicializar el mapa con la ubicac
function iniciarMapa(ubicCliente) {
    //Variable para la ubicacion inicial del mapa
    const ubicacionMapa = {
        center: { lat: -33.521405, lng: -70.769129 },
        zoom: 17
    };

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

// Condición para verificar que se generó el mapa

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
        //Creamos el marcador del cliente y lo añadimos al mapa
        const marcadorCliente = new google.maps.Marker({
            position: ubicCliente,
            map: map,
            title: "Destino",
        });

    // Creamos un servicio para obtener direcciones utilizando la API de Google Maps
    //Asignamos la ruta a una variable 
        const obtenerDirecciones = new google.maps.DirectionsService();
        const ruta = new google.maps.DirectionsRenderer({ map: map });

        obtenerDirecciones.route({
            origin: ubicCliente,
            destination: ubicLocal,
            travelMode: google.maps.TravelMode.DRIVING
        }, (respuesta, estado) => {
            if (estado === "OK") {
                ruta.setDirections(respuesta);
            } else {
                alert("No se pudo mostrar la ruta debido a: " + estado);
            }
        });

    } else {
        console.error('No se encontró el elemento con el ID "map" en el DOM.');
    }
}

// Cargar la API de Google Maps y llamar a inicializarMapa una vez que esté cargada
async function inicializarMapa() {
    try {
        await cargarAPI('https://maps.googleapis.com/maps/api/js?key=AIzaSyCRzMttEjK-7jt1hS9Q5pSlGgknH0Vx2rM&callback=iniciarMapa');
        console.log('API de Google Maps cargada exitosamente');
        iniciarMapa();
    } catch (error) {
        console.error('Error al cargar la API de Google Maps:', error);
    }
}

// Llamar a la función para inicializar el mapa
inicializarMapa();