$(document).ready(function () {
    let pokemonCount = 0;
    let pokemonCountDetails = 0;
    let selectedPokemons = [];
    let selectedPokemonsDetails = [];
    let pokemonArray = [];
    let allPkmArray = [];
    let nav = $('#types_nav');
    let flag = 0;

    let pokemonArray2 = [];  // Guardar todos los Pokémon del tipo seleccionado
    let currentPage = 1;    // Página actual para paginación
    let Pages = 0;
    const pokemonsPerPage = 10;  // Cantidad de Pokemones por página

    // Búsqueda de la vista searchResult

    const $searchButton = $('.search-button');
    const $logoButton = $('.logoClass');
    const $searchInput = $('.search-input');
    const $surveyButton = $('.surveyButton');
    const $teamHistoryButton = $('.teamhistory');
    const $historyButton = $('.infohistory');
    const $contactButton = $('.contact');

    const $pokemonContainer = $('.pokemons');
    const $pokemonContainer2 = $('#noHistoryMessage');
    const $searchTitle = $('#searchTitle');

    const $linkButton = $('.link');

    
    loadSavedPokemons();
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
        //localStorage.removeItem('infoHistory'); // Esto es para borrar el item del LocalStorage
        window.location.href = "infoHistory.html";
    });

    // Evento de hacer click en contacto
    $contactButton.on('click', function () {
        //localStorage.removeItem('infoHistory'); // Esto es para borrar el item del LocalStorage
        window.location.href = "contact.html";
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


    // ----------------------------------  Funciones  ---------------------------------- //

    function loadSavedPokemons() {
        // Recuperar la lista de IDs de Pokémon guardada en sessionStorage
        let savedPokemonIds = JSON.parse(sessionStorage.getItem('pokemonIds')) || [];

        // Limpiamos las cards antes de cargar nuevas
        clearCards();
    
        // Si la lista está vacía
        if (savedPokemonIds.length === 0) {
            console.log("No hay Pokémon guardados.");
            let msg = '<p>No hay historial de pokemones.</p>'
            $pokemonContainer2.append(msg);
            return;
        }
    
        let pokemonArray2 = [];  // Reiniciamos el array donde almacenaremos los Pokémon
    
        // Hacemos una solicitud AJAX por cada ID de Pokémon
        let requests = savedPokemonIds.map(id => {
            return $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${parseInt(id)}`,
                type: 'GET',
                dataType: 'json',
                success: function(pokemonData) {
                    pokemonArray.push(pokemonData);
                    // Agregamos los datos de cada Pokémon al array (sin mostrar las cards aún)
                    pokemonArray2.push(pokemonData);
                },
                error: function() {
                    console.log(`Error al obtener los detalles del Pokémon con ID: ${id}`);
                }
            });
        });
    
        // Esperamos a que todas las solicitudes AJAX terminen
        $.when(...requests).done(function() {
            // Ordenamos el array de Pokémon por su ID
            pokemonArray2.sort((a, b) => a.id - b.id);

            //console.log(pokemonArray2);
    
            // Mostramos las cards en orden
            pokemonArray2.forEach(pokemon => {
                addPokemonCard(pokemon);  // Mostrar cada card en la página
            });
    
            // Crear los botones de paginación
            //createPaginationButtons();
    
            // Si usas paginación, puedes inicializar la página actual
            currentPage = 1;
            //loadPokemonPage(currentPage);
        });
    }

    function loadPokemonPage(page) {
        const startIndex = (page - 1) * pokemonsPerPage;
        const endIndex = startIndex + pokemonsPerPage;
        const pokemonsToShow = pokemonArray2.slice(startIndex, endIndex);
        
        clearCards(); // Limpiar las cards antes de agregar nuevas
        clearDetails(); // Limpia los detalles al pasar a la otra página

        //pokemonArray.push(pokemonsToShow); // Llenamos el array con nuevos pokes
        //addPokemonCard(pokemonsToShow);  // Mostrar cada card en la página
    }

    function createPaginationButtons() {
        Pages = Math.ceil(pokemonArray2.length / pokemonsPerPage);
        const totalPages = Pages;
        const $paginationContainer = $('#pagination');  // Contenedor de paginación
        $paginationContainer.empty();  // Limpiar botones anteriores
        $('.paginationContainer').empty();

        // Botón "Anterior"
        const $prevButton = $('<button>')
        .text('Anterior')
        .addClass('page-btn prev')
        .prop('disabled', currentPage === 1)  // Desactivar si está en la primera página
        .on('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadPokemonPage(currentPage);
                createPaginationButtons(); // Actualizar los botones de paginación
            }
        });

        $('.paginationContainer').append($prevButton);
    
        // Crear un botón por cada página
        for (let i = 1; i <= totalPages; i++) {
            const $pageButton = $('<button>')
                .text(i)
                .addClass('page-btn')
                .on('click', function() {
                    currentPage = i;  // Cambiar a la página seleccionada
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
        .prop('disabled', currentPage === totalPages)  // Desactivar si está en la última página
        .on('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadPokemonPage(currentPage);
                createPaginationButtons(); // Actualizar los botones de paginación
            }
        });

        $('.paginationContainer').append($nextButton);
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

    // Función para actualizar el texto del total de Pokémon en la página.
    function updatePokemonInfo() {
        if (pokemonCountDetails > 0) {
            if(pokemonCount > 0){
                $('#teamSelected').css('position', 'relative');
            }
            $('#pokemonDetails').css('opacity', '1');
            $('#pokemonDetails').addClass('visible');
        }
        // Una vez que se hace click en +info, no desaparece mas el aside a menos que se realize otra búsqueda
        // else {
        //     $('#pokemonDetails').css('opacity', '0');
        //     $('#pokemonDetails').removeClass('visible');
        // }
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
        //var pokemonGif = findPokemonGifByID(parseInt(foundPokemon.id)); //Esto está para las posibles cards que llevan a la info del siguiente poke

        //console.log(foundPokemon);

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

        //Cuando se llama a pokemonSpecieAJAX, debes pasar una función que se ejecutará cuando los datos hayan sido recibidos
        pokemonSpecieAJAX(foundPokemon.name, 4, function(description) { //4 para obtener la descripción del poke
            if (description) {
                // Aquí haces lo que necesites con la descripción
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

        // Guardo la info del poke en la sessionStorage (ELIMINAR)
        // sessionStorage.setItem('pkmShareInfo', pokemonInfo);
        

        //  * BOTÓN PARA COMPARTIR POKEMONES DEL ASIDE *

        $buttonSection.find('.detailsButton2').remove();

        let roundButton2 = `
            <button class="detailsButton2 round-button btn2">Compartir</button>
        `;

        $buttonSection.append(roundButton2);

        // Añade un evento para eliminar la selección cuando se presione el botón.
        $('.btn2').on('click', function() {
            window.location.href = "share.html";
        });

        //  * BOTÓN PARA ELIMINAR POKEMONES DEL ASIDE *

        $buttonSection.find('.detailsButton').remove();

        let roundButton = `
            <button class="detailsButton round-button redButton">Borrar selección</button>
        `;

        $buttonSection.append(roundButton);

        // Añade un evento para eliminar la selección cuando se presione el botón.
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

    function clearCards(){ //solo borra las card del main
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

    function pokemonSpecieAJAX(pokemonName, type, callback){
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`,
            method: 'GET',
            success: function(data) {

                if(type == 0){
                    // Filtramos para obtener la categoría en inglés
                    const genera = data.genera.find(gen => gen.language.name === "en");

                    // Agregamos la categoría al elemento con id "pokemonGenus"
                    $('#pokemonGenus').text(genera.genus);
                }

                if(type == 1){

                    // Obtenemos las descripciones del Pokémon
                    const flavorTexts = data.flavor_text_entries;

                    // Filtramos las descripciones en español (u otro idioma si lo prefieres)
                    const descriptionES = flavorTexts.find(entry => entry.language.name === "es");

                    // Agregamos la categoría al elemento con id "pokemonGenus"
                    $('#pkmDescription').text(descriptionES.flavor_text);
                }

                if(type == 2){
                    // Verificamos si el Pokémon tiene género o no
                    const genderRate = data.gender_rate;
                    let male, female, noGender;
                    //console.log("genero: " + genderRate);

                    if (genderRate === -1) {
                        noGender = "Sin género";
                    } else {
                        // Calculamos las proporciones de macho y hembra
                        const femalePercent = (genderRate / 8) * 100;
                        const malePercent = 100 - femalePercent;

                        male = `${malePercent}%`;
                        female = `${femalePercent}%`;
                    }

                    // Agregamos la categoría al elemento con id "pokemonGenus"
                    $('#pokemonSexMale').text(male);
                    $('#pokemonSexFemale').text(female);
                            // ******Faltaría mandar en caso de que no tenga género ******
                }

                if(type == 3){
                    // Obtenemos las descripciones del Pokémon
                    const habitatText = data.habitat;

                    // Agregamos la categoría al elemento con id "pokemonGenus"
                    $('#habitat').text(habitatText.name);
                }

                if(type == 4){
                    // Obtenemos las descripciones del Pokémon
                    const flavorTexts = data.flavor_text_entries;

                    // Filtramos las descripciones en español (u otro idioma si lo prefieres)
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
                callback(null); // En caso de error, llamamos al callback con un valor nulo o un mensaje de error
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
                per_page: 10 // Limita a 10 resultados, por ejemplo
            },
            success: function(response) {
                // Obtener un índice aleatorio dentro del rango de fotos devueltas
                const randomIndex = Math.floor(Math.random() * response.photos.photo.length);
                const photo = response.photos.photo[randomIndex];
                const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
    
                // Mostrar la imagen en el banner
                $(".banner").html(`<img src="${imgUrl}" alt="Advertisement" />`);
            }
        });
    }

});


