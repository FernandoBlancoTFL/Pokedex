function initLeafletMap() {
    var map = L.map('map').setView([-34.922883333333, -57.956316666667], 16); // Coordenadas de La Plata

    // Cargo los tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marcador en la ubicación
    L.marker([-34.922883333333, -57.956316666667]).addTo(map)
        .bindPopup('Ubicación de la oficina')
        .openPopup();
}

// Ejecuto la función cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initLeafletMap);
