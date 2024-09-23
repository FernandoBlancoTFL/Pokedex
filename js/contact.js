function initMap() {
    // const catedralLaPlata = { lat: -34.9214, lng: -57.9544 }; //coordenadas anteriores

    // Coordenadas de la Catedral de La Plata
    const catedralLaPlata = {lat:-34.922883333333, lng:-57.956316666667};

    // Crear el mapa centrado en la Catedral de La Plata
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: catedralLaPlata,
    });

    // Marcador para la Catedral de La Plata
    const marker = new google.maps.Marker({
        position: catedralLaPlata,
        map: map,
        title: 'Catedral de La Plata'
    });
}
