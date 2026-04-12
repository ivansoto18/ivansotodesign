/* mapa contacto*/

let options = {
    enableHighAccuracy: true,
    timeOut: 5000,
    maximumAge: 0
}

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        success,
        error,
        options);

} else {
    alert("Los servicios de geolocalización no están disponibles.")
}

function success(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let map = L.map('map', {
        center:[43.363979149381855, -5.86121141910553,],
        zoom: 14
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Iván Soto Design'}).addTo(map);

    let control = L.Routing.control ({
        waypoints: [
            L.latLng(latitude, longitude),
            L.latLng(43.363979149381855, -5.86121141910553)
        ],
        language:'es',

    }).addTo(map);

}

function error(){

}

/* JSON noticias en Home */
document.addEventListener("DOMContentLoaded", () => {
    
    const newsGrid = document.getElementById('news-grid');
    const apiKey = 'e11b2b0b84ac19acf63cefbb4eb74895'; // Mi clave de GNews
    const topic = 'desarrollo web';
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=es&max=6&apikey=${apiKey}`;
  
    async function cargarNoticias() {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }

            const data = await response.json();
            
            // Mensaje de error
            if (data.articles.length === 0) {
                newsGrid.innerHTML = "<p>No se encontraron noticias sobre desarrollo web.</p>";
                return;
            }

            renderizarNoticias(data.articles);

        } catch (error) {
            console.error("Error al conectar con la API:", error);
            newsGrid.innerHTML = `
                <p>Hubo un problema al cargar las noticias.</p>
                <p style="font-size: 0.8rem; color: gray;">Detalle: ${error.message}</p>
            `;
        }
    }

    function renderizarNoticias(articulos) {
        newsGrid.innerHTML = "";

        articulos.forEach(art => {
            const card = document.createElement('article');
            card.className = 'news-card';
            
            // Diseño de la tarjeta de cada noticia
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${art.image || './assets/images/placeholder-news.webp'}')"></div>
                <div class="card-content">
                    <small>${formatearFecha(art.publishedAt)}</small>
                    <h3>${art.title}</h3>
                    <p>${art.description.substring(0, 100)}...</p>
                    <a href="${art.url}" target="_blank">Leer más</a>
                </div>
            `;
            
            newsGrid.appendChild(card);
        });
    }

    // Modificar el formato de fecha
    function formatearFecha(fechaISO) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
    }

    // Cargar las noticias
    cargarNoticias();
});