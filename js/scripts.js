$(document).ready(function() {  
    let pokemonCount = 0;
    let selectedPokemons = [];
    let pokemonArray = [];
    let nav = $('#types_nav');

    // Función para cargar los Pokémon de la primera generación.
    function cargarPokemonesPrimeraGeneracion() {
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon?limit=151', //`https://pokeapi.co/api/v2/generation/${generationId}/`
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('.pokemons').empty();  // Limpia cualquier card existente.

                const pokemonDetailsPromises = data.results.map(pokemon => {
                    return $.ajax({
                        url: pokemon.url,
                        type: 'GET',
                        dataType: 'json'
                    });
                });

                Promise.all(pokemonDetailsPromises)
                    .then(detailsArray => {
                        detailsArray.sort((a, b) => a.id - b.id);  // Ordena los Pokémon por ID.
                        pokemonArray = detailsArray;

                        detailsArray.forEach(details => {
                            const card = `
                                <div class="pokemon">
                                    <img class="pokemon-img" src="${details.sprites.other['official-artwork'].front_default}" alt="${details.name}">
                                    <p id="idnum">#${details.id.toString().padStart(3, '0')}</p>
                                    <p>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</p>
                                    <div class="types extra-content">
                                        ${details.types.map(type => `<p class="${type.type.name}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</p>`).join('')}
                                    </div>
                                </div>
                            `;
                            // Agrega la card al contenedor principal.
                            $('.pokemons').append(card);
                        });
                    })
                    .catch(error => {
                        console.log('Error al obtener detalles de los Pokémon:', error);
                    });
            },
            error: function() {
                console.log('Error al obtener los Pokémon de la primera generación.');
            }
        });
    }

    // Delegación de eventos para manejar el click en imágenes cargadas dinámicamente.
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
            
            // Elimina al Pokémon del arreglo de seleccionados.
            selectedPokemons = selectedPokemons.filter(pokemon => pokemon.name !== pokemonName);
        } else{
            if(pokemonCount <= 5){
                $this.addClass('selected').css('opacity', '0.6');
                $pokemon.css('background-color', '#f0f0f0');
                nav.css('position', 'relative'); // El nav no sigue al usuario por pantalla
                pokemonCount++;
                
                // Si el pokemon no está en la lista (busca por id), agrega el nombre, la imagen y el ID
                if (!selectedPokemons.some(pokemon => pokemon.id === pokemonId)) {
                    selectedPokemons.push({name: pokemonName, img: pokemonImg, id: pokemonId}); //guarda un objeto con nombre, imagen e ID
                }
            }
            else{
                alert('No puedes seleccionar mas de 6 pokemones');
            }
            
        }

        updatePokemonTotal();
        updatePokemonList();
    });

    // Función para actualizar el texto del total de Pokémon en la página.
    function updatePokemonTotal() {
        $('#pokemon-total').text('Pokemones seleccionados: ' + pokemonCount);

        if (pokemonCount > 0) {
            $('#teamSelected').fadeIn();
        } else {
            $('#teamSelected').fadeOut();
        }
    }

    // Función para actualizar el contenido del aside con los Pokémon seleccionados.
    function updatePokemonList() {
        let $teamSelected = $('#teamSelected');

        $teamSelected.find('section.pokemon-entry').remove(); // Vacio aside

        selectedPokemons.forEach((pokemon) => {
            var pokemonGif = findPokemonGifByID(parseInt(pokemon.id));

            if ($teamSelected.find('section.pokemon-entry').length < 6) {
                let newSection = `
                    <section class="pokemon-entry teamColor">
                        <img class="pkm-img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Ícono personalizado">
                        <p> ${pokemon.name} </p>
                        <img class="pokemon-gif" src="${pokemonGif}">
                    </section>
                `;
                $teamSelected.append(newSection);

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
        return foundPokemon.sprites.other['showdown'].front_default; //retorna el gif de ese pokemon
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

    // Llama a la función para cargar los Pokémon al cargar la página.
    cargarPokemonesPrimeraGeneracion();
});
