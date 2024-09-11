$(document).ready(function () {
    let pokemonCount = 0;
    let pokemonCountDetails = 0;
    let selectedPokemons = [];
    let selectedPokemonsDetails = [];
    let pokemonArray = [];
    let nav = $('#types_nav');

    // Búsqueda de la vista searchResult

    const $searchButton = $('.search-button');
    const $searchInput = $('.search-input');
    const $pokemonContainer = $('.pokemons');
    const $fireButton = $('.fire');
    const $waterButton = $('.water');
    const $grassButton = $('.grass');
    const $electricButton = $('.electric');
    const $normalButton = $('.normal');

    $fireButton.on('click', function () {
        searchByType('fire');
    });

    $waterButton.on('click', () => searchByType('water'));

    $grassButton.on('click', () => searchByType('grass'));

    $electricButton.on('click', () => searchByType('electric'));

    $normalButton.on('click', () => searchByType('normal'));

    // Evento de hacer click en el botón de búsqueda
    $searchButton.on('click', function () {
        const searchTerm = $searchInput.val().trim().toLowerCase();

        if (!searchTerm) {
            alert('Por favor, ingresa un nombre, ID o tipo de Pokémon.');
            return;
        }

        clearCardsAndAsides();

        if (isNaN(searchTerm)) {
            // Si no es un número, buscar por nombre o tipo
            if (isValidType(searchTerm)) {
                searchByType(searchTerm);
            } else {
                searchByName(searchTerm);
            }
        } else {
            searchById(searchTerm);
        }
    });

    // Búsqueda desde la vista index2.html

    const searchTerm = sessionStorage.getItem('searchTerm');

    if (!searchTerm) {
        alert('No se encontró ningún término de búsqueda.');
        return;
    }

    $pokemonContainer.empty(); // Borramos los pokemones por defecto
    clearCardsAndAsides();

    console.log("El contenido del local storage es: " + searchTerm);

    if (isNaN(searchTerm)) {
        if (isValidType(searchTerm)) {
            searchByType(searchTerm);
        } else {
            searchByName(searchTerm);
        }
    } else {
        searchById(searchTerm);
    }

    //sessionStorage.removeItem('searchTerm'); // Borro el contenido del sessionStorage                     (DESCOMENTAR)

    // ----------------------------------  Eventos  ---------------------------------- //

    // Delegación de eventos para manejar el click en cards cargadas dinámicamente.
    $(document).on('click', 'div.pokemon img', function() {
        let $this = $(this);
        let $pokemon = $this.closest('.pokemon');
        let pokemonName = $pokemon.find('p').eq(1).text();
        let pokemonImg = $this.attr('src');
        let pokemonIdString = $pokemon.find('#idnum').text();
        let pokemonId = pokemonIdString.replace('#', '');

        // Verifica si el Pokémon ya está seleccionado.
        if ($this.hasClass('selected')) {
            $this.removeClass('selected').css('opacity', '1');
            $pokemon.css('background-color', '');
            pokemonCount--;
            if (pokemonCount == 0) nav.css('position', 'sticky');
            
            // Elimina el nombre del Pokémon del arreglo de seleccionados.
            selectedPokemons = selectedPokemons.filter(pokemon => pokemon.name !== pokemonName);
        } else{
            if(pokemonCount <= 5){
                $this.addClass('selected').css('opacity', '0.6');
                $pokemon.css('background-color', '#f0f0f0');
                nav.css('position', 'relative');
                pokemonCount++;
                
                if (!selectedPokemons.some(pokemon => pokemon.id === pokemonId)) {
                    selectedPokemons.push({name: pokemonName, img: pokemonImg, id: pokemonId}); // Guarda un objeto con nombre, imagen e ID
                }
            }
            else{
                alert('No puedes seleccionar mas de 6 pokemones');
            }
            
        }
        //generateSection();
        updatePokemonTotal();
        updatePokemonList();
    });

    // Delegación de eventos para manejar el click en cards cargadas dinámicamente. (+ info)
    $(document).on('click', 'div.pokemon button', function() {
        let $this = $(this);
        let $pokemon = $this.closest('.pokemon');
        let pokemonName = $pokemon.find('p').eq(1).text();
        let pokemonImg = $this.attr('src');
        let pokemonIdString = $pokemon.find('#idnum').text();
        let pokemonId = pokemonIdString.replace('#', '');

        if ($this.hasClass('selected')) {
            $this.removeClass('selected');
            pokemonCountDetails--;
            if (pokemonCountDetails == 0) nav.css('position', 'sticky');
            
            selectedPokemonsDetails = selectedPokemonsDetails.filter(pokemon => pokemon.name !== pokemonName);
        } else{
            if(pokemonCountDetails <= 5){
                $this.addClass('selected');
                nav.css('position', 'relative');
                pokemonCountDetails++;
                
                // Si el pokemon no está en la lista (busca por id), agrega el nombre, la imagen y el ID
                if (!selectedPokemonsDetails.some(pokemon => pokemon.id === pokemonId)) {
                    selectedPokemonsDetails = [];
                    selectedPokemonsDetails.push({name: pokemonName, img: pokemonImg, id: pokemonId});
                }
            }
            else{
                alert('No puedes seleccionar mas de 6 pokemones');
            }
            
        }
        updatePokemonInfo();
        updatePokemonDetail(pokemonId);
    });


    // ----------------------------------  Funciones  ---------------------------------- //

    function isValidType(type) {
        const validTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
        return validTypes.includes(type);
    }

    function searchByName(name) {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            method: 'GET',
            success: function (pokemon) {
                pokemonArray = [];      // Borro los pokemones que haya
                pokemonArray.push(pokemon);
                
                addPokemonCard(pokemon);

                selectedPokemons = [];
            },
            error: function () {
                alert('Pokémon no encontrado.');
            }
        });
    }

    function searchById(id) {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
            method: 'GET',
            success: function (pokemon) {
                pokemonArray = [];
                pokemonArray.push(pokemon);

                addPokemonCard(pokemon);
            },
            error: function () {
                alert('Pokémon no encontrado.');
            }
        });
    }

    function searchByType(type) {
        $.ajax({
            url: `https://pokeapi.co/api/v2/type/${type}`,
            method: 'GET',
            success: function(typeData) {

                clearCardsAndAsides();

                let pokemons10 = typeData.pokemon.slice(0, 10); // Limitamos a 10 Pokémon

                const pokemonDetailsPromises = pokemons10.map(pokemonEntry => {
                    return $.ajax({
                        url: pokemonEntry.pokemon.url,
                        type: 'GET',
                        dataType: 'json'
                    });
                });

                Promise.all(pokemonDetailsPromises)
                    .then(detailsArray => {

                        detailsArray.sort((a, b) => a.id - b.id);

                        pokemonArray = [];
                        pokemonArray = detailsArray;

                        //console.log(pokemonArray);
                        
                        detailsArray.forEach(details => {
                            addPokemonCard(details);
                        });
                    })
                    .catch(error => {
                        console.log('Error al obtener detalles de los Pokémon:', error);
                    });
            },
            error: function() {
                alert('Tipo no encontrado.');
            }
        });
    }

    function addPokemonCard(details) {
        const card = `
            <div class="pokemon">
                <img class="pokemon-img" src="${details.sprites.other['official-artwork'].front_default}" alt="${details.name}">
                <p id="idnum">#${details.id.toString().padStart(3, '0')}</p>
                <p>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</p>
                <div class="types extra-content">
                    ${details.types.map(type => `<p class="${type.type.name}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</p>`).join('')}
                </div>
                <button class="info-button">+ info</button>
            </div>
        `;
        // Agrega la card al contenedor principal
        $pokemonContainer.append(card);
    }

    // Función para actualizar el texto del total de Pokémon en el aside.
    function updatePokemonTotal() {
        $('#pkm-total').text('Pokemones seleccionados: ' + pokemonCount);

        if (pokemonCount > 0) {
            $('#teamSelected').addClass('visible'); // Muestra el aside pkmTeam
            $('#teamSelected').css('opacity', '1');    //ponerle un efecto que simule fadeIn/fadeOut?


        } else {
            $('#teamSelected').removeClass('visible'); // Oculta el aside
            $('#teamSelected').css('opacity', '0');
        }
    }

    // Función para actualizar el contenido del aside con los Pokémon seleccionados.
    function updatePokemonList() {
        let $teamSelected = $('#teamSelected');
        let $section = $('#pkmTeamContainer');

        $section.find('section.pokemon-entry').remove();

        selectedPokemons.forEach((pokemon) => { //Recorre y por cada poke agrega una section con la imagen de la pokebola, el nombre y el gif
            var pokemonGif = findPokemonGifByID(parseInt(pokemon.id));

            if ($section.find('section.pokemon-entry').length < 6) { // Colocar un contenedor que tenga el p y el section agregado dinamicamente
                let newSection = `
                    <section class="pokemon-entry teamColor">
                        <img class="pkm-img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Ícono personalizado">
                        <p> ${pokemon.name} </p>
                        <img class="pokemon-gif" src="${pokemonGif}">
                    </section>
                `;
                $section.append(newSection);

                console.log("paso por acá");

                // Llama a la función de animación para hacer que la imagen gire un poco
                animatePokemonImage($('.pkm-img').last());
            }

        });

        // Si ya existe el botón, lo elimina
        $teamSelected.find('.round-button').remove();

        // Añade un botón al final del aside.
        let roundButton = `
            <button class="round-button">Borrar selección</button>
        `;
        $teamSelected.append(roundButton);

        $('.round-button').on('click', function() {
            // Vacía el array de Pokémon seleccionados y reinicia el contador.
            selectedPokemons = [];
            pokemonCount = 0;

            // Borra todos los sections (pokemones)
            $teamSelected.find('section.pokemon-entry').remove();

            // Restablece el contador de Pokémon seleccionados (borra aside).
            updatePokemonTotal();
            if (pokemonCount == 0) {nav.css('position', 'sticky');};

            // Restablece el estado de las imágenes de Pokémon a no seleccionadas.
            $('img.selected').removeClass('selected').css('opacity', '1');
            $('.pokemon').css('background-color', '');
        });
    }

    function findPokemonGifByID(id) {
        let foundPokemon = pokemonArray.find(pokemonArray => pokemonArray.id === id);
        return foundPokemon.sprites.other['showdown'].front_default;
    }

    // Función para animar la pokebola
    function animatePokemonImage($image) {
        let rotateAngle = -15;
        let direction = 1;

        // Bucle
        setInterval(function() {
            rotateAngle = direction * 15;

            $image.animate({ value: rotateAngle }, {
                
                step: function(now) {
                    $(this).css('transform', 'rotate(' + now + 'deg)');
                },

                duration: 200,

                // 'swing' hace que la animación sea más suave al principio y al final.
                easing: 'swing',

                complete: function() {
                    direction *= -1;
                }
            });
        }, 500);
    }

    // Función para actualizar el texto del total de Pokémon en la página.
    function updatePokemonInfo() {
        $('#pkmDetails-total').text('Pokemones seleccionados: ' + pokemonCountDetails);

        if (pokemonCountDetails > 0) {
            $('#pokemonDetails').addClass('visible');
            $('#pokemonDetails').css('opacity', '1');
        } else {
            $('#pokemonDetails').css('opacity', '0');
            $('#pokemonDetails').removeClass('visible');
        }
    }

    // Función para actualizar el contenido del aside con los Pokémon seleccionados.
    function updatePokemonDetail(idPokemon) {
        let $teamSelected = $('#pokemonDetails');
        $teamSelected.find('section.pokemon-entry').remove();

        const foundPokemon = pokemonArray.find(pokemon => pokemon.id == idPokemon); //foundPokemon tiene todos los datos del poke a mostrar

        if ($teamSelected.find('section.pokemon-entry').length < 6) {
            let newSection = `
                <section class="pokemon-entry teamColor">
                    <div class="image-container">
                        <img class="" src="${foundPokemon.sprites.other['official-artwork'].front_default}" alt="${foundPokemon.name}">
                    </div>
                    <p> ${foundPokemon.name} </p>
                </section>
            `;
            $teamSelected.append(newSection);
        }

        $teamSelected.find('.round-button').remove();

        let roundButton = `
            <button class="round-button">Borrar selección</button>
        `;
        $teamSelected.append(roundButton);

        // Añade un evento para eliminar la selección cuando se presione el botón.
        $('.round-button').on('click', function() {
            selectedPokemonsDetails = [];
            pokemonCountDetails = 0;

            $teamSelected.find('section.pokemon-entry').remove();

            updatePokemonInfo();
            if (pokemonCountDetails == 0) {nav.css('position', 'sticky');};

            $('button.selected').removeClass('selected').css('opacity', '1');
            $('.pokemon').css('background-color', '');
        });
    }

    function clearCardsAndAsides(){
        $pokemonContainer.empty();
        pokemonCount = 0;
        pokemonCountDetails = 0;
        updatePokemonTotal();
        updatePokemonInfo();
    }

});
