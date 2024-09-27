$(document).ready(function () {
    const $searchButton = $('.search-button');
    const $searchInput = $('.search-input');
    const $fireButton = $('.fire');
    const $waterButton = $('.water');
    const $grassButton = $('.grass');
    const $electricButton = $('.electric');
    const $normalButton = $('.normal');
    const $fightingButton = $('.fighting');
    const $flyingButton = $('.flying');
    const $groundButton = $('.ground');
    const $rockButton = $('.rock');
    const $bugButton = $('.bug');
    const $ghostButton = $('.ghost');
    const $steelButton = $('.steel');
    const $psychicButton = $('.psychic');
    const $iceButton = $('.ice');
    const $dragonButton = $('.dragon');
    const $darkButton = $('.dark');
    const $fairyButton = $('.fairy');

    $fireButton.on('click', () => changeView('fire'));
    $waterButton.on('click', () => changeView('water'));
    $grassButton.on('click', () => changeView('grass'));
    $electricButton.on('click', () => changeView('electric'));
    $normalButton.on('click', () => changeView('normal'));
    $fightingButton.on('click', () => changeView('fighting'));
    $flyingButton.on('click', () => changeView('flying'));
    $groundButton.on('click', () => changeView('ground'));
    $rockButton.on('click', () => changeView('rock'));
    $bugButton.on('click', () => changeView('bug'));
    $ghostButton.on('click', () => changeView('ghost'));
    $steelButton.on('click', () => changeView('steel'));
    $psychicButton.on('click', () => changeView('psychic'));
    $iceButton.on('click', () => changeView('ice'));
    $dragonButton.on('click', () => changeView('dragon'));
    $darkButton.on('click', () => changeView('dark'));
    $fairyButton.on('click', () => changeView('fairy'));


    // Evento de hacer click en el botón de búsqueda y redirige a index.html
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
    
        // Redirige a index.html
        window.location.href = 'index.html';
    }

});
