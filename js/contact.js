function initLeafletMap() {
    var map = L.map('map').setView([-34.922883333333, -57.956316666667], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([-34.922883333333, -57.956316666667]).addTo(map)
        .bindPopup('Ubicación de la oficina')
        .openPopup();
}

document.addEventListener('DOMContentLoaded', initLeafletMap);
