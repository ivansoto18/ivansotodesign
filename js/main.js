// mapa sección Contacto

document.addEventListener("DOMContentLoaded", () => {
    
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
            alert("Los servicios de geolocalización no están disponibles.");
        }
    }

    function success(position) {
        // Si se necesitan, mostramos las coordenadas del usuario
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let map = L.map('map').setView([43.363979149381855, -5.86121141910553], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Iván Soto Design'
        }).addTo(map);

        L.marker([43.363979149381855, -5.86121141910553]).addTo(map)
            .bindPopup('Iván Soto - Diseñador Web')
            .openPopup();
    }

    function error(err) {
        console.warn(`Error de geolocalización (${err.code}): ${err.message}`);
        // Si el usuario niega la geolocalización, cargamos el mapa igual en nuestra ubicación
        let map = L.map('map').setView([43.363979149381855, -5.86121141910553], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    // Noticias en Home
    const newsGrid = document.getElementById('news-grid');
    
    async function cargarNoticias() {
    console.log("1. Intentando cargar noticias..."); // Log de control
    
    if (!newsGrid) {
        console.error("Error: No se encontró el elemento #news-grid en el HTML");
        return; 
    }

    const apiKey = 'e11b2b0b84ac19acf63cefbb4eb74895';
    const topic = 'diseño web OR programación';
    const targetUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=es&max=3&apikey=${apiKey}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
        console.log("2. Llamando a la API a través del proxy...");
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        console.log("3. Datos recibidos de la API:", data);

        if (data.articles && data.articles.length > 0) {
            renderizarNoticias(data.articles);
            console.log("4. Noticias renderizadas con éxito");
        } else {
            console.warn("La API no devolvió artículos.");
            newsGrid.innerHTML = "<p>No hay noticias disponibles en este momento.</p>";
        }
    } catch (err) {
        console.error("Error en el proceso de noticias:", err);
    }
}

    function renderizarNoticias(articulos) {
        newsGrid.innerHTML = "";
        articulos.forEach(art => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${art.image || './assets/images/favicon.webp'}')"></div>
                <div class="card-content">
                    <small>${new Date(art.publishedAt).toLocaleDateString('es-ES')}</small>
                    <h3>${art.title}</h3>
                    <p>${art.description.substring(0, 100)}...</p>
                    <a href="${art.url}" target="_blank">Leer más</a>
                </div>
            `;
            newsGrid.appendChild(card);
        });
    }

    /* Ejecutar la carga de noticias */
    cargarNoticias();

    /* Calculo de precio selección en formulario */

    const form = document.querySelector('.contact-form');
    const totalDisplay = document.getElementById('presupuestoTotal');

    if (form && totalDisplay) {
        const calcularPresupuesto = () => {
            let total = 0;

            /* Cálculo de valor de producto */
            const productoSeleccionado = form.querySelector('input[name="producto"]:checked');
            if (productoSeleccionado) {
                total += parseFloat(productoSeleccionado.value);
            }

            /* Cálculo de extras */
            const extras = form.querySelectorAll('input[type="checkbox"]:checked');
            extras.forEach(extra => {
                if (extra.id !== 'privacidad' && extra.value) {
                    total += parseFloat(extra.value);
                }
            });

            /* Cálculo de plazo */
            const plazoInput = document.getElementById('plazo_entrega');
            const plazo = plazoInput ? parseInt(plazoInput.value) || 0 : 0;
            if (plazo > 60) {
                total *= 0.80; /* 20% descuento si el plazo es mayor a 60 días */
            }

            totalDisplay.value = total.toFixed(2) + " €";
        };

        form.addEventListener('change', calcularPresupuesto);
        form.addEventListener('input', calcularPresupuesto);
    }

});

/* validación de datos formulario */

function validar(formulario) {
    let valido = true;
    let mensajesError = "";

    /* Validar nombre */

    const validarNombre = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{1,15}$/;
    if (!validarNombre.test(formulario.name.value)) {
        valido = false;
        mensajesError += "- Nombre: letras solamente y máx 15 caracteres.\n";
    }

    /* Validar apellido */

    const validarApellido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{1,40}$/;
    if (!validarApellido.test(formulario.apellido.value)) {
        valido = false;
        mensajesError += "- Apellido: letras solamente y máx 40 caracteres.\n";
    }

    /* Validar teléfono */

    const validarTelefono = /^[0-9]{9}$/;
    if (!validarTelefono.test(formulario.telefono.value)) {
        valido = false;
        mensajesError += "- Teléfono: exactamente 9 números.\n";
    }

    /* Validar email */

    const validarEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!validarEmail.test(formulario.email.value)) {
        valido = false;
        mensajesError += "- Email no válido.\n";
    }

    /* Validación final datos formulario */

    if (valido) {
        alert("Muchas gracias por enviar el formulario. Me pondré en contacto contigo pronto.");
        formulario.submit();
    } else {
        alert("Errores en el formulario:\n" + mensajesError);
    }
}