$(document).ready(function () {
    const $searchButton = $('.search-button');
    const $searchInput = $('.search-input');
    const $fireButton = $('.fire');
    const $waterButton = $('.water');
    const $grassButton = $('.grass');
    const $electricButton = $('.electric');
    const $normalButton = $('.normal');

    $fireButton.on('click', function () {
        changeView('fire');
    });

    $waterButton.on('click', () => changeView('water'));

    $grassButton.on('click', () => changeView('grass'));

    $electricButton.on('click', () => changeView('electric'));

    $normalButton.on('click', () => changeView('normal'));

    // Evento de hacer click en el botón de búsqueda y redirige a searchResult.html
    $searchButton.on('click', function () {
        const searchTerm = $searchInput.val().trim().toLowerCase();
    
        if (!searchTerm) {
            alert('Por favor, ingresa un nombre, ID o tipo de Pokémon.');
            return;
        } else {
            changeView(searchTerm);
        }
    });

    function changeView(srchTerm){
        if (!srchTerm) {
            alert('Por favor, ingresa un nombre, ID o tipo de Pokémon.');
            return;
        }
    
        // Almacena el término de búsqueda en sessionStorage
        sessionStorage.setItem('searchTerm', srchTerm);
    
        // Redirige a searchResult.html
        window.location.href = 'searchResult.html';
    }

});
