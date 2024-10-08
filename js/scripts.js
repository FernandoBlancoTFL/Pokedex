$(document).ready(function () {
    let pokemonCount = 0;
    let pokemonCountDetails = 0;
    let selectedPokemons = [];
    let selectedPokemonsDetails = [];
    let pokemonArray = [];
    let pokemonArray2 = [];
    let pokemonArray3 = []; // Para el filtro de legendarios
    let allPkmArray = [];
    let nav = $('#types_nav');
    let currentPage = 1; // Paginación
    let Pages = 0;
    const pokemonsPerPage = 10;

    const $searchButton = $('.search-button');
    const $logoButton = $('.logoClass');
    const $searchInput = $('.search-input');
    const $surveyButton = $('.surveyButton');
    const $teamHistoryButton = $('.teamhistory');
    const $historyButton = $('.infohistory');
    const $contactButton = $('.contact');
    const $adButton = $('.adButton');
    const $linkButton = $('.link');

    const $pokemonContainer = $('.pokemons');
    const $searchTitle = $('#searchTitle');
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

    // Búsqueda de la vista searchResult

    $fireButton.on('click', function () {
        searchByType('fire');
    });
    $waterButton.on('click', () => searchByType('water'));
    $grassButton.on('click', () => searchByType('grass'));
    $electricButton.on('click', () => searchByType('electric'));
    $normalButton.on('click', () => searchByType('normal'));
    $fightingButton.on('click', () => searchByType('fighting'));
    $flyingButton.on('click', () => searchByType('flying'));
    $groundButton.on('click', () => searchByType('ground'));
    $rockButton.on('click', () => searchByType('rock'));
    $bugButton.on('click', () => searchByType('bug'));
    $ghostButton.on('click', () => searchByType('ghost'));
    $steelButton.on('click', () => searchByType('steel'));
    $psychicButton.on('click', () => searchByType('psychic'));
    $iceButton.on('click', () => searchByType('ice'));
    $dragonButton.on('click', () => searchByType('dragon'));
    $darkButton.on('click', () => searchByType('dark'));
    $fairyButton.on('click', () => searchByType('fairy'));

    // Búsqueda desde otra vista HTML
    const searchTerm = sessionStorage.getItem('searchTerm');

    if (searchTerm !== null && searchTerm.trim() !== "") {
        console.log("El contenido del session storage es: " + searchTerm);

        clearCards();
        clearDetails();

        $searchTitle.css('display','block');

        searchValidation(searchTerm);

        sessionStorage.removeItem('searchTerm'); // Borro el contenido del sessionStorage 
    } else{
        flag = 1;
        loadFirstGenPokemons();
    }

    // Función de publicidad
    loadAd();

    // ----------------------------------  Eventos  ---------------------------------- //

    // Evento de hacer click en el botón de búsqueda
    $searchButton.on('click', function () {
        const searchTerm = $searchInput.val().trim().toLowerCase();

        if (!searchTerm) {
            alert('Por favor, ingresa un nombre, ID o tipo de Pokémon.');
            return;
        }

        searchValidation(searchTerm);

        clearCards();
        clearDetails();
        $searchTitle.css('display','block');
    });

    // Evento de hacer click en el logo
    $logoButton.on('click', function () {
        flag = 1;
        $searchTitle.css('display','none');
        $pokemonContainer.css('margin-top', '');
        $(".paginationContainer").css('display','flex');
        loadFirstGenPokemons();
    });

    // Evento de hacer click en otro enlace
    $linkButton.on('click', function () {
        $(".paginationContainer").css('display','none');
    });

    // Evento de hacer click en encuesta
    $surveyButton.on('click', function () {
        window.location.href = "survey.html";
    });

    // Evento de hacer click en equipo pokemon
    $teamHistoryButton.on('click', function () {
        window.location.href = "teamHistory.html";
    });

    // Evento de hacer click en historial
    $historyButton.on('click', function () {
        window.location.href = "infoHistory.html";
    });

    // Evento de hacer click en contacto
    $contactButton.on('click', function () {
        window.location.href = "contact.html";
    });

    // Evento de hacer click en algún botón que haga cambiar la publicidad
    $adButton.on('click', function () {
        loadAd();
    });

    // Evento para las imágenes de las cards pokemon
    $(document).on('click', 'div.pokemon img', function() {
        let $this = $(this);
        let $pokemon = $this.closest('.pokemon');
        let pokemonName = $pokemon.find('p').eq(1).text();
        let pokemonImg = $this.attr('src');
        let pokemonIdString = $pokemon.find('#idnum').text();
        let pokemonId = pokemonIdString.replace('#', '');
        let $pkmTeamName = $('#pkmName');

        // Verifica si el Pokémon ya está seleccionado.
        if ($this.hasClass('selected')) {
            $this.removeClass('selected').css('opacity', '1');
            $pokemon.css('background-color', '');
            pokemonCount--;

            if (pokemonCount == 0) nav.css('position', 'sticky');

            // Devuelve un array con todos los pokes, menos el poke con ese nombre
            selectedPokemons = selectedPokemons.filter(pokemon => pokemon.name !== pokemonName);
        } else{
            if(pokemonCount <= 5){
                $this.addClass('selected').css('opacity', '0.6');
                $pokemon.css('background-color', '#f0f0f0');

                if(pokemonCountDetails > 0){
                    $('#teamSelected').css('position', 'relative');
                }
                nav.css('position', 'relative');
                
                if (!selectedPokemons.some(pokemon => pokemon.id === pokemonId) && pokemonName != $pkmTeamName) {
                    var pokemonGif = findPokemonGifByID(parseInt(pokemonId));
                    pokemonCount++;
                    selectedPokemons.push({name: pokemonName, img: pokemonImg, id: pokemonId, gif: pokemonGif}); // Guarda un objeto con nombre, imagen e ID
                }
            }
            else{
                alert('No puedes seleccionar mas de 6 pokemones');
            }
            
        }
        updatePokemonTotal();
        updatePokemonTeamList();
    });

    // Delegación de eventos para eliminar pokemones del team del aside
    $(document).on('click', '.pokemon-entry', function() {
        let $this = $(this); 
        let $pokemonName = $this.closest('.pokemon-entry').find('#pkmName').text().trim();

        // Selecciono el contenedor del Pokémon y su imagen más cercana
        let $pokemonContainer = $('div.pokemon').filter(function() {
            return $(this).find('p:contains("' + $pokemonName + '")').length > 0;
        });
        
        let $pokemonImage = $pokemonContainer.find('img');

        $pokemonImage.removeClass('selected').css('opacity', '1');
        $pokemonContainer.css('background-color', '');
        pokemonCount--;

        if (pokemonCount == 0) nav.css('position', 'sticky');

        // Devuelve un array con todos los pokes, menos el poke con ese nombre
        selectedPokemons = selectedPokemons.filter(pokemon => pokemon.name !== $pokemonName);

        updatePokemonTotal();
        updatePokemonTeamList();
    });

    // Evento para el botón + info
    $(document).on('click', 'div.pokemon button', function() {
        let $this = $(this);
        let $pokemon = $this.closest('.pokemon');
        let pokemonName = $pokemon.find('p').eq(1).text();
        let pokemonImg = $this.attr('src');
        let pokemonIdString = $pokemon.find('#idnum').text();
        let pokemonId = pokemonIdString.replace('#', '');

        // Guardo los pokes seleccionados en el sessionStorage

        // Obtengo el array de IDs guardados en el sessionStorage o inicializo un array vacío si no existe
        let savedPokemonIds = JSON.parse(sessionStorage.getItem('pokemonIds')) || [];

        // Verifico si el ID del poke seleccionado ya existe para evitar duplicados
        if (!savedPokemonIds.includes(pokemonId)) {
            savedPokemonIds.push(pokemonId);

            // Guardo el array actualizado en sessionStorage
            sessionStorage.setItem('pokemonIds', JSON.stringify(savedPokemonIds));
        }

        if ($this.hasClass('selected')) {
            $this.removeClass('selected');
            pokemonCountDetails--;
            
            selectedPokemonsDetails = selectedPokemonsDetails.filter(pokemon => pokemon.name !== pokemonName);
        } else{
            $this.addClass('selected');
            pokemonCountDetails++;
            nav.css('position', 'relative');
            
            // Si el pokemon no está en la lista (busca por id), agrega el nombre, la imagen y el ID
            if (!selectedPokemonsDetails.some(pokemon => pokemon.id === pokemonId)) {
                selectedPokemonsDetails = [];
                selectedPokemonsDetails.push({name: pokemonName, img: pokemonImg, id: pokemonId});
            }
        }
        updatePokemonInfo();
        updatePokemonDetail(pokemonId);
    });

    // Delegación de eventos para botón de filtro (Tipos)
    $('#pokemon-filter').on('change', function() {
        const optionValue = this.value;

        const pkmnsNewTypeFilter = allPkmArray.filter(pokemon => 
            pokemon.types.some(type => type.type.name === optionValue)
        ).map(pokemon => {
            return {
                name: pokemon.name,
                url: "https://pokeapi.co/api/v2/pokemon/" + pokemon.id + "/"
            };
        });

        pokemonArray2 = pkmnsNewTypeFilter;

        currentPage = 1;
        loadPokemonPage(currentPage);
        createPaginationButtons();
    });

    // Delegación de eventos para botón de filtro (Legendarios)
    $('#pokemon-filterOpt2').on('change', function() {
        const optionValue = this.value;
        
        if(optionValue == "Si"){
            const pkmnsNewLegendaryFilter = pokemonArray2.map(pokemonEntry => {
                const url = pokemonEntry.pokemon ? pokemonEntry.pokemon.url : pokemonEntry.url;
    
                // Retorna una promesa que recupera la especie del Pokémon
                return $.ajax({
                    url: url.replace('pokemon', 'pokemon-species'), // Cambia la URL para obtener los detalles de la especie
                    type: 'GET',
                    dataType: 'json'
                });
            });
    
            Promise.all(
                pkmnsNewLegendaryFilter.map(pokemonPromise =>
                    pokemonPromise.catch(error => {
                        if (error.status === 404) {
                            //console.warn("Pokemon no encontrado:", error);
                            return null;  // Retorna null para ignorar este Pokémon
                        }
                        //throw error;
                    })
                )
            )
            .then(results => {
                // Filtro los Pokémon que no son null y los que son legendarios
                const legendaryPokemons = results
                    .filter(pokemonSpecies => pokemonSpecies && pokemonSpecies.is_legendary);

                // Si la lista está vacía, imprimo mensaje
                if (legendaryPokemons.length === 0) {
                    clearCards();
                    let msg = '<p>No hay Pokemones legendarios con ese filtro.</p>'
                    $pokemonContainer.append(msg);
                    $('.paginationContainer').css('margin-top', 'auto');
                    return;
                }
            
                // Obtengo los ids de los Pokémon legendarios
                const legendaryPokemons2 = legendaryPokemons.map(pokemon => pokemon.id);
            
                // Obtengo el nombre y la url de los pokemones legendarios y los almaceno en pokemonArray2
                const filteredPokemonList = allPkmArray
                    .filter(pokemon => legendaryPokemons2.includes(pokemon.id))
                    .map(pokemon => {
                        return {
                            name: pokemon.name,
                            url: "https://pokeapi.co/api/v2/pokemon/" + pokemon.id + "/"
                        };
                    });
            
                pokemonArray2 = filteredPokemonList;
            
                currentPage = 1;
                loadPokemonPage(currentPage);
                createPaginationButtons();
            })
            .catch(error => {
                console.error('Error al obtener las especies de Pokémon:', error);
            });
        } else{
            pokemonArray2 = pokemonArray3;

            currentPage = 1;
            loadPokemonPage(currentPage);
            createPaginationButtons();
        }
        
        
    });


    // ----------------------------------  Funciones  ---------------------------------- //

    // Función para cargar los Pokémon de la primera generación.
    function loadFirstGenPokemons() {
        $(".filterSection").css('display','flex');
        clearCards();
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon?limit=151',
            type: 'GET',
            dataType: 'json',
            success: function(data) {

                pokemonArray2 = data.results;

                // Cargo la primera página de Pokémon
                currentPage = 1;
                loadPokemonPage(currentPage);
                createPaginationButtons();
            },
            error: function() {
                console.log('Error al obtener los Pokémon de la primera generación.');
            }
        });
    }

    function loadAd() {
        $.ajax({
            url: "https://api.flickr.com/services/rest/",
            data: {
                method: "flickr.photos.search",
                api_key: "ebf228e94e43ae7f2cda5bafc62cb8dd",
                tags: "advertising banner",
                format: "json",
                nojsoncallback: 1,
                per_page: 10 // Límite de 10 resultados 
            },
            success: function(response) {
                // índice aleatorio dentro del rango de fotos devueltas
                const randomIndex = Math.floor(Math.random() * response.photos.photo.length);
                const photo = response.photos.photo[randomIndex];
                const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
    
                $(".banner").html(`<img src="${imgUrl}" alt="Advertisement" />`);
            }
        });
    }
    
    function isValidType(type) {
        const validTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
        return validTypes.includes(type);
    }

    function searchValidation(searchTerm){
        if (isNaN(searchTerm)) {
            if (isValidType(searchTerm)) {
                searchByType(searchTerm);
            } else {
                $searchTitle.css('display','block');
                $pokemonContainer.css('margin-top', '10px');
                $(".filterSection").css('display','none');
                $(".paginationContainer").css('display','none');
                $(".footer").css('margin-top','auto');
                searchByName(searchTerm);
            }
        } else {
            $searchTitle.css('display','block');
            $pokemonContainer.css('margin-top', '10px');
            $(".filterSection").css('display','none');
            $(".paginationContainer").css('display','none');
            $(".footer").css('margin-top','auto');
            searchById(searchTerm);
        }
    }

    function searchByName(name) {
        flag = 0;
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            method: 'GET',
            success: function (pokemon) {
                pokemonArray.push(pokemon);
                addPokemonCard(pokemon);
            },
            error: function () {
                alert('Pokémon no encontrado.');
            }
        });
    }

    function searchById(id) {
        flag = 0;
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
            method: 'GET',
            success: function (pokemon) {
                pokemonArray.push(pokemon);
                addPokemonCard(pokemon);
            },
            error: function () {
                alert('Pokémon no encontrado.');
            }
        });
    }

    function searchByType(type) {
        flag = 0;
        $(".filterSection").css('display','flex');
        $searchTitle.css('display','block');
        $pokemonContainer.css('margin-top', '10px');
        $(".paginationContainer").css('display','flex');
        $.ajax({
            url: `https://pokeapi.co/api/v2/type/${type}`,
            method: 'GET',
            success: function(typeData) {

                // Guardo los pokes seleccionados (tipos)
                pokemonArray2 = typeData.pokemon;
                
                currentPage = 1;
                loadPokemonPage(currentPage);
                createPaginationButtons();

            },
            error: function() {
                alert('Tipo no encontrado.');
            }
        });
    }

    function loadPokemonPage(page) {
        const startIndex = (page - 1) * pokemonsPerPage;
        const endIndex = startIndex + pokemonsPerPage;
        const pokemonsToShow = pokemonArray2.slice(startIndex, endIndex);
        let pokemonDetailsPromises;
        
        clearCards(); // Limpiar las cards antes de agregar nuevas
        clearDetails(); // Limpia los detalles al pasar a la otra página

        if (pokemonArray3.length === 0) {
            pokemonArray3 = pokemonArray2;
        }

        saveCurrentPokemonsInfo();

        // Solicito los detalles de cada Pokémon en la página actual
        pokemonDetailsPromises = pokemonsToShow.map(pokemonEntry => {
            // Determina la URL correcta
            const url = pokemonEntry.pokemon ? pokemonEntry.pokemon.url : pokemonEntry.url;

            return $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json'
            });
        });
    
        // Una vez obtenidos los detalles, agrego las cards
        Promise.all(pokemonDetailsPromises)
            .then(detailsArray => {
                detailsArray.sort((a, b) => a.id - b.id);
    
                detailsArray.forEach(details => {
                    pokemonArray.push(details);
                    addPokemonCard(details);
                });

            })
            .catch(error => {
                console.log('Error al obtener detalles de los Pokémon:', error);
            });
    }

    function createPaginationButtons() {
        Pages = Math.ceil(pokemonArray2.length / pokemonsPerPage);
        const totalPages = Pages;
        const $paginationContainer = $('#pagination');
        $paginationContainer.empty();  // Limpio botones anteriores
        $('.paginationContainer').empty();

        // Botón "Anterior"
        const $prevButton = $('<button>')
        .text('Anterior')
        .addClass('page-btn prev')
        .prop('disabled', currentPage === 1)  // Se desactiva si está en la primera página
        .on('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadPokemonPage(currentPage);
                createPaginationButtons(); // Actualiza los botones de paginación
            }
        });

        $('.paginationContainer').append($prevButton);
    
        // Botones numericos
        for (let i = 1; i <= totalPages; i++) {
            const $pageButton = $('<button>')
                .text(i)
                .addClass('page-btn')
                .on('click', function() {
                    currentPage = i;
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth' // Para un desplazamiento suave
                    });
                    loadPokemonPage(currentPage);
                });
    
            $paginationContainer.append($pageButton);
            $('.paginationContainer').append($paginationContainer);
        }

        // Botón "Siguiente"
        const $nextButton = $('<button>')
        .text('Siguiente')
        .addClass('page-btn next')
        .prop('disabled', currentPage === totalPages)  // Se desactiva si está en la última página
        .on('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadPokemonPage(currentPage);
                createPaginationButtons();
            }
        });

        $('.paginationContainer').append($nextButton);
    }

    // Guarda la info de todos los pokes en pantalla
    function saveCurrentPokemonsInfo() {
        allPkmArray = [];
        let allPokemonsDetails;

        allPokemonsDetails = pokemonArray2.map(pokemonEntry => {
            const url = pokemonEntry.pokemon ? pokemonEntry.pokemon.url : pokemonEntry.url;

            return $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json'
            });
        });

        Promise.all(allPokemonsDetails)
            .then(detailsArray => {
                detailsArray.forEach(details => {
                    allPkmArray.push(details);
                });

                // Llamo a las funciones para agregar los filtros
                AddfilterPokemonsTypes();
                AddfilterPokemonsLegendary();
            })
            .catch(error => {
                console.log('Error al obtener detalles de los Pokémon:', error);
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
            $('#teamSelected').addClass('visible');
            $('#teamSelected').css('opacity', '1');
        } else {
            $('#teamSelected').removeClass('visible');
            $('#teamSelected').css('opacity', '0');
        }
    }

    // Función para actualizar el contenido del aside con los Pokémon seleccionados.
    function updatePokemonTeamList() {
        let $section = $('#pkmTeamContainer');
        $section.find('section.pokemon-entry').remove(); // Borra los pokemones del team aside

        selectedPokemons.forEach((pokemon) => { //Recorre y por cada poke agrega una section con la imagen de la pokebola, el nombre y el gif
            var pokemonGif = findPokemonGifByID(parseInt(pokemon.id));

            if ($section.find('section.pokemon-entry').length < 6) {
                let newSection = `
                    <section class="pokemon-entry teamColor">
                        <img class="pkm-img" id="pkm-img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Ícono personalizado">
                        <p id="pkmName" class="pkmName"> ${pokemon.name} </p>
                        <img class="pokemon-gif" src="${pokemonGif}">
                    </section>
                    
                `;
                $section.append(newSection);

                // Llamo a la función de animación para hacer que la imagen gire un poco
                animatePokemonImage($('.pkm-img').last());
            }
        });

        addButtonsTeam();
        
    }

    function addButtonsTeam(){
        let $buttonSection = $('.btnSection');
        //  * BOTÓN PARA ELIMINAR POKEMONES DEL ASIDE *

        // Si ya existe el botón, lo elimina
        $buttonSection.find('.round-button').remove();

        // Añade un botón al final del aside.
        let roundButton = `
            <button class="teamButton round-button redButton">Borrar selección</button>
        `;
        $buttonSection.append(roundButton);

        $('.teamButton').on('click', function() {
            clearTeam();
        });

        //  * BOTÓN PARA GUARDAR POKEMONES *

        // Si ya existe el botón, lo elimina
        $buttonSection.find('.btn').remove();

        // Añade un botón al final del aside.
        let roundButton2 = `
            <button class="teamButton2 round-button btn">Guardar equipo</button>
        `;

        $buttonSection.append(roundButton2);

        $('.btn')
        .prop('disabled', pokemonCount < 6)
        .on('click', function() {
            let storedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];
            storedTeams.push(selectedPokemons);  // Agregar el equipo actual a la lista
            localStorage.setItem('pokemonTeams', JSON.stringify(storedTeams));
            clearTeam();
            alert('Equipo guardado correctamente.');
        });
    }

    function findPokemonGifByID(idPokemon) {
        let foundPokemon = pokemonArray.find(pokemon => pokemon.id === idPokemon);
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
        if (pokemonCountDetails > 0) {
            if(pokemonCount > 0){
                $('#teamSelected').css('position', 'relative');
            }
            $('#pokemonDetails').css('opacity', '1');
            $('#pokemonDetails').addClass('visible');
        }
    }

    // Función para actualizar el contenido del aside con los Pokémon seleccionados.
    function updatePokemonDetail(idPokemon) {
        let $section = $('#pkmDetailContainer');
        let value = 0;

        // Borro los contenedores del aside
        $section.find('section.pokemon_MainDetail_Container').remove();
        $section.find('section.pokemon_MainDetail').remove();
        $section.find('section.pokemon_SecondaryDetail').remove();
        $section.find('section.pokemon_EvolutionDetail').remove();

        const foundPokemon = pokemonArray.find(pokemon => pokemon.id == idPokemon); // foundPokemon tiene todos los datos del poke a mostrar

        if(foundPokemon.types.length == 2){
            value = 1;
        }

        pokemonSpecieAJAX(foundPokemon.name, 0); //0 para traer categoría del poke
        pokemonSpecieAJAX(foundPokemon.name, 1); //1 para obtener la descripción del poke
        pokemonSpecieAJAX(foundPokemon.name, 2); //2 para obtener el sexo del poke
        pokemonSpecieAJAX(foundPokemon.name, 3); //3 para obtener el habitat del poke
        
        let MainDetailSection = `
            <section class="pokemon_MainDetail_Container ${foundPokemon.types[0].type.name}">
                <section class="image-container teamColor">
                    <img src="${foundPokemon.sprites.other['official-artwork'].front_default}" alt="${foundPokemon.name}"></img>
                </section>
                <section class="pokemon_MainDetail teamColor">
                    <div class="pokemon_MainDetail_1">
                        <h3> ${foundPokemon.name.charAt(0).toUpperCase()}${foundPokemon.name.slice(1)} </h3>
                        <p id="pokemonGenus" ></p>
                    </div>

                    <div class="pokemon_MainDetail_2">
                        <h4> #${idPokemon} </h4>
                        <div class="pokemon_MainDetail_2_container">
                            <div class="pokemon_MainDetail_2-1">
                                <div class="pokemon_MainDetail_2-1ImgMale">
                                    <img src="/img/male.png"></img>
                                </div>
                                <p id="pokemonSexMale" ></p>
                            </div>

                            <div class="pokemon_MainDetail_2-2">
                                <div class="pokemon_MainDetail_2-2ImgFemale">
                                    <img src="/img/female.png"></img>
                                </div>
                                <p id="pokemonSexFemale" ></p>
                            </div>
                        </div>
                        
                    </div>

                    <div class="types pkmTypes">
                        ${foundPokemon.types.map(type => `<p class="${type.type.name}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</p>`).join('')}
                    </div>
                    
                </section>
            </section>
            
        `;

        let SecondaryDetailSection = `
            <section class="pokemon_SecondaryDetail ${foundPokemon.types[value].type.name}">
                <section class="pokemon-DescriptionDetail teamColor">
                    <p id="pkmDescription"> ${foundPokemon.name} </p>
                </section>
                <section class="pokemon-HabilitiesDetail teamColor">
                    <h4> Habilidades </h4>
                    <div class="pokemon-HabilitiesDetail_Hblt">
                        ${foundPokemon.abilities.map(abilities => `<p class="steel">${abilities.ability.name.charAt(0).toUpperCase() + abilities.ability.name .slice(1)}</p>`).join('')}
                    </div>
                    <div class="pokemon-HabilitiesDetail_2_container">
                        <div class="pokemon-HabilitiesDetail_2">
                            <h4> Altura </h4>
                            <p id="pkmHeight"> ${foundPokemon.height}m </p>
                        </div>
                        <div class="pokemon-HabilitiesDetail_2">
                            <h4> Peso </h4>
                            <p id = "pkmWeight"> ${foundPokemon.weight}Kg </p>
                        </div>
                    </div>
                    <div class="pokemon-HabilitiesDetail_2_container2">
                        <div class="pokemon-HabilitiesDetail_2">
                            <h4> Hábitat </h4>
                            <p id="habitat"> </p>
                        </div>
                        <div class="pokemon-HabilitiesDetail_2">
                            <h4> EXP Base </h4>
                            <p> ${foundPokemon.base_experience} </p>
                        </div>
                    </div>
                    <div class="pokemon-HabilitiesDetail_2_container3">
                        <div class="pokemon-StatsDetailContainer">
                            <p id="pkmHp"> HP </p>
                            <p>${foundPokemon.stats[0].base_stat}</p>
                        </div>
                        <div class="pokemon-StatsDetailContainer">
                            <p id="pkmAtk"> ATK </p>
                            <p>${foundPokemon.stats[1].base_stat}</p>
                        </div>
                        <div class="pokemon-StatsDetailContainer">
                            <p id="pkmDef"> DEF </p>
                            <p>${foundPokemon.stats[2].base_stat}</p>
                        </div>
                        <div class="pokemon-StatsDetailContainer">
                            <p id="pkmSpa"> SpA </p>
                            <p>${foundPokemon.stats[3].base_stat}</p>
                        </div>
                        <div class="pokemon-StatsDetailContainer">
                            <p id="pkmSpd"> SpD </p>
                            <p>${foundPokemon.stats[4].base_stat}</p>
                        </div>
                        <div class="pokemon-StatsDetailContainer">
                            <p id="pkmSpeed"> SPD </p>
                            <p>${foundPokemon.stats[5].base_stat}</p>
                        </div>
                        <div class="pokemon-StatsDetailContainer TotalStat">
                            <p id="pkmTotal"> TOT </p>
                            <p>${foundPokemon.stats[0].base_stat + 
                                foundPokemon.stats[1].base_stat + 
                                foundPokemon.stats[2].base_stat +
                                foundPokemon.stats[3].base_stat +
                                foundPokemon.stats[4].base_stat +
                                foundPokemon.stats[5].base_stat
                            }</p>
                        </div>
                    </div>
                </section>
            </section>
        `;

        $section.append(MainDetailSection);
        $section.append(SecondaryDetailSection);

        //Cuando se llama a pokemonSpecieAJAX, se le pasa una función que se ejecutará cuando los datos hayan sido recibidos
        pokemonSpecieAJAX(foundPokemon.name, 4, function(description) { //4 para obtener la descripción del poke
            if (description) {
                addButtonsInfo(foundPokemon.name, idPokemon, foundPokemon.types, description); 
            } else {
                console.error("No se pudo obtener la descripción");
            }
        });
        
    }

    function addButtonsInfo(pkmName, pkmID, pkmType, pkmDesc){
        let $buttonSection = $('.btnSection2');
        let pokemonInfo = [pkmName, pkmID, pkmType, pkmDesc];

        // Guardo la info del poke en la sessionStorage como un string JSON
        sessionStorage.setItem('pkmShareInfo', JSON.stringify(pokemonInfo));

        //  * BOTÓN PARA COMPARTIR POKEMONES DEL ASIDE *

        $buttonSection.find('.detailsButton2').remove();

        let roundButton2 = `
            <button class="detailsButton2 round-button btn2">Compartir</button>
        `;

        $buttonSection.append(roundButton2);

        $('.btn2').on('click', function() {
            window.location.href = "share.html";
        });

        //  * BOTÓN PARA ELIMINAR POKEMONES DEL ASIDE *

        $buttonSection.find('.detailsButton').remove();

        let roundButton = `
            <button class="detailsButton round-button redButton">Borrar selección</button>
        `;

        $buttonSection.append(roundButton);

        // Añado un evento para eliminar la selección cuando se presione el botón.
        $('.detailsButton').on('click', function() {
            selectedPokemonsDetails = [];
            pokemonCountDetails = 0;

            $buttonSection.find('section.pkmTeamContainer').remove();

            updatePokemonInfo();
            $('#teamSelected').css('position', 'sticky');

            $('#pokemonDetails').css('opacity', '0');
            $('#pokemonDetails').removeClass('visible');

            $('button.selected').removeClass('selected').css('opacity', '1');
        });

        
        
    }

    function clearCards(){ // Solo borra las card del main
        $pokemonContainer.empty();
    }

    function clearDetails(){ // Borra el aside de details y le da sticky al aside de team
        let $aside = $('#pokemonDetails');
        selectedPokemonsDetails = [];
        pokemonCountDetails = 0;

        $aside.find('section.pkmTeamContainer').remove();

        updatePokemonInfo();
        $('#teamSelected').css('position', 'sticky');

        $('#pokemonDetails').css('opacity', '0');
        $('#pokemonDetails').removeClass('visible');

        $('button.selected').removeClass('selected').css('opacity', '1');
    }

    function clearTeam(){
        // Vacía el array de Pokémon seleccionados y reinicia el contador.
        selectedPokemons = [];
        pokemonCount = 0;

        // Restablece el contador de Pokémon seleccionados (borra aside).
        updatePokemonTotal();
        
        // Borro los pokemones del aside
        let $section = $('#pkmTeamContainer');
        $section.find('section.pokemon-entry').remove();

        // Restablece el estado de las imágenes de Pokémon a no seleccionadas.
        $('img.selected').removeClass('selected').css('opacity', '1');
        $('.pokemon').css('background-color', '');
    }

    function pokemonSpecieAJAX(pokemonName, type, callback){
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`,
            method: 'GET',
            success: function(data) {

                if(type == 0){
                    // Filtro para obtener la categoría en español
                    const genera = data.genera.find(gen => gen.language.name === "es");

                    // Agrego la categoría al elemento
                    $('#pokemonGenus').text(genera.genus);
                }

                if(type == 1){
                    // Obtengo las descripciones del Pokémon
                    const flavorTexts = data.flavor_text_entries;

                    // Filtro las descripciones en español
                    const descriptionES = flavorTexts.find(entry => entry.language.name === "es");

                    $('#pkmDescription').text(descriptionES.flavor_text);
                }

                if(type == 2){
                    // Verifico si el Pokémon tiene género o no
                    const genderRate = data.gender_rate;
                    let male, female, noGender;

                    if (genderRate === -1) {
                        noGender = "Sin género";
                    } else {
                        // Calculo el porcentaje de macho y hembra
                        const femalePercent = (genderRate / 8) * 100;
                        const malePercent = 100 - femalePercent;

                        male = `${malePercent}%`;
                        female = `${femalePercent}%`;
                    }

                    $('#pokemonSexMale').text(male);
                    $('#pokemonSexFemale').text(female);
                            // **Faltaría mandar en caso de que no tenga género **
                }

                if(type == 3){
                    // Obtengo el habitad del Pokémon
                    const habitatText = data.habitat;

                    $('#habitat').text(habitatText.name);
                }

                if(type == 4){
                    // Obtenemos las descripciones del Pokémon
                    const flavorTexts = data.flavor_text_entries;
                    const descriptionES = flavorTexts.find(entry => entry.language.name === "es");

                    if (descriptionES) {
                        result = descriptionES.flavor_text;
                    } else {
                        result = "Descripción no disponible en español.";
                    }
    
                    // Llamamos al callback con el resultado
                    callback(result);
                }

            },
            error: function() {
                console.error('Error al obtener la categoría del Pokémon');
                callback(null); // En caso de error, llamp al callback con un valor nulo o un mensaje de error
            }
        });
    }

    function AddfilterPokemonsTypes(){
        let $section = $('#pokemon-filter');

        // Creo un nuevo array para almacenar tipos únicos
        const pkmsTypes = [];

        // Recorro cada Pokémon en el array
        allPkmArray.forEach(pokemon => {
            // Recorremos cada tipo de cada pokémon
            pokemon.types.forEach(type => {
                const typeName = type.type.name;

                // Si el tipo aún no está en el array pkmsTypes, lo agregamos
                if (!pkmsTypes.includes(typeName)) {
                    pkmsTypes.push(typeName);
                }
            });
        });

        // Agrego el menu desplegable

        // Borro los contenedores del aside
        $section.find('option.optType').remove();

        $section.find('option.optPlaceholder').remove();

        let optionTypePlaceholder = `
                <option class="optPlaceholder" value="" disabled selected>Tipo</option>
            `;

        $section.append(optionTypePlaceholder);

        pkmsTypes.forEach(type => {
            let optionType = `
                <option class="optType">${type}</option>
            `;
            
            $section.append(optionType);
        });
    }

    function AddfilterPokemonsLegendary(){
        let $section = $('#pokemon-filterOpt2');

        // Agrego el menu desplegable

        // Borro los contenedores del aside
        $section.find('option.optType2').remove();

        $section.find('option.optPlaceholder2').remove();

        let optionTypePlaceholder2 = `
                <option class="optPlaceholder2" value="" disabled selected>Legendario</option>
            `;

        $section.append(optionTypePlaceholder2);

        let optionType = `
            <option class="optType2">Si</option>
        `;

        let optionType2 = `
            <option class="optType2">No</option>
        `;
            
        $section.append(optionType);
        $section.append(optionType2);

    }

});


