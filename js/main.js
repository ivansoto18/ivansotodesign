/* mapa contactoc*/

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
        center:[latitude, longitude],
        zoom: 14
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Iván Soto Design'}).addTo(map);

    let control = L.Routing.control ({
        waypoints: [
            L.latLng(latitude, longitude),
            L.latLng(43.536511125122495, -5.637495434481138)
        ],
        language:'es',

    }).addTo(map);

}

function error(){

}