$(document).ready(function () {
    let pokemonCount = 0;
    let pokemonCountDetails = 0;
    let selectedPokemonsDetails = [];
    let pokemonArray = [];
    let nav = $('#types_nav');

    const $logoButton = $('.logoClass');
    const $surveyButton = $('.surveyButton');
    const $teamHistoryButton = $('.teamhistory');
    const $historyButton = $('.infohistory');
    const $contactButton = $('.contact');

    const $pokemonContainer = $('.pokemons');
    const $pokemonContainer2 = $('#noHistoryMessage');

    const $linkButton = $('.link');
    
    loadSavedPokemons();
    loadAd();

    $logoButton.on('click', function () {
        window.location.href = "index.html";
    });

    $linkButton.on('click', function () {
        $(".paginationContainer").css('display','none');
    });

    $surveyButton.on('click', function () {
        window.location.href = "survey.html";
    });

    $teamHistoryButton.on('click', function () {
        window.location.href = "teamHistory.html";
    });

    $historyButton.on('click', function () {
        window.location.href = "infoHistory.html";
    });

    $contactButton.on('click', function () {
        window.location.href = "contact.html";
    });

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
            
            if (!selectedPokemonsDetails.some(pokemon => pokemon.id === pokemonId)) {
                selectedPokemonsDetails = [];
                selectedPokemonsDetails.push({name: pokemonName, img: pokemonImg, id: pokemonId});
            }
        }
        updatePokemonInfo();
        updatePokemonDetail(pokemonId);
    });


    function loadSavedPokemons() {
        let savedPokemonIds = JSON.parse(sessionStorage.getItem('pokemonIds')) || [];
        clearCards();
    
        if (savedPokemonIds.length === 0) {
            console.log("No hay Pokémon guardados.");
            let msg = '<p>No hay historial de pokemones.</p>'
            $pokemonContainer2.append(msg);
            return;
        }
    
        let pokemonArray2 = [];
    
        let requests = savedPokemonIds.map(id => {
            return $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${parseInt(id)}`,
                type: 'GET',
                dataType: 'json',
                success: function(pokemonData) {
                    pokemonArray.push(pokemonData);
                    pokemonArray2.push(pokemonData);
                },
                error: function() {
                    console.log(`Error al obtener los detalles del Pokémon con ID: ${id}`);
                }
            });
        });

        Promise.all(requests)
        .then(() => {
            pokemonArray2.sort((a, b) => a.id - b.id);
            pokemonArray2.forEach(pokemon => {
                addPokemonCard(pokemon);
            });
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

        $pokemonContainer.append(card);
    }

    function updatePokemonInfo() {
        if (pokemonCountDetails > 0) {
            if(pokemonCount > 0){
                $('#teamSelected').css('position', 'relative');
            }
            $('#pokemonDetails').css('opacity', '1');
            $('#pokemonDetails').addClass('visible');
        }
    }

    function updatePokemonDetail(idPokemon) {
        let $section = $('#pkmDetailContainer');
        let value = 0;

        $section.find('section.pokemon_MainDetail_Container').remove();
        $section.find('section.pokemon_MainDetail').remove();
        $section.find('section.pokemon_SecondaryDetail').remove();
        $section.find('section.pokemon_EvolutionDetail').remove();

        const foundPokemon = pokemonArray.find(pokemon => pokemon.id == idPokemon);

        if(foundPokemon.types.length == 2){
            value = 1;
        }

        pokemonSpecieAJAX(foundPokemon.name, 0);
        pokemonSpecieAJAX(foundPokemon.name, 1);
        pokemonSpecieAJAX(foundPokemon.name, 2);
        pokemonSpecieAJAX(foundPokemon.name, 3);
        
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

        pokemonSpecieAJAX(foundPokemon.name, 4, function(description) {
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

        sessionStorage.setItem('pkmShareInfo', JSON.stringify(pokemonInfo));


        $buttonSection.find('.detailsButton2').remove();

        let roundButton2 = `
            <button class="detailsButton2 round-button btn2">Compartir</button>
        `;

        $buttonSection.append(roundButton2);

        $('.btn2').on('click', function() {
            window.location.href = "share.html";
        });

        $buttonSection.find('.detailsButton').remove();

        let roundButton = `
            <button class="detailsButton round-button redButton">Borrar selección</button>
        `;

        $buttonSection.append(roundButton);

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

    function clearCards(){
        $pokemonContainer.empty();
    }

    function pokemonSpecieAJAX(pokemonName, type, callback){
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`,
            method: 'GET',
            success: function(data) {

                if(type == 0){
                    const genera = data.genera.find(gen => gen.language.name === "es");

                    $('#pokemonGenus').text(genera.genus);
                }

                if(type == 1){
                    const flavorTexts = data.flavor_text_entries;

                    const descriptionES = flavorTexts.find(entry => entry.language.name === "es");

                    $('#pkmDescription').text(descriptionES.flavor_text);
                }

                if(type == 2){
                    const genderRate = data.gender_rate;
                    let male, female, noGender;

                    if (genderRate === -1) {
                        noGender = "Sin género";
                    } else {
                        const femalePercent = (genderRate / 8) * 100;
                        const malePercent = 100 - femalePercent;

                        male = `${malePercent}%`;
                        female = `${femalePercent}%`;
                    }

                    $('#pokemonSexMale').text(male);
                    $('#pokemonSexFemale').text(female);
                }

                if(type == 3){
                    const habitatText = data.habitat;

                    $('#habitat').text(habitatText.name);
                }

                if(type == 4){
                    const flavorTexts = data.flavor_text_entries;
                    const descriptionES = flavorTexts.find(entry => entry.language.name === "es");

                    if (descriptionES) {
                        result = descriptionES.flavor_text;
                    } else {
                        result = "Descripción no disponible en español.";
                    }
                    callback(result);
                }

            },
            error: function() {
                console.error('Error al obtener la categoría del Pokémon');
                callback(null);
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
                per_page: 10
            },
            success: function(response) {
                const randomIndex = Math.floor(Math.random() * response.photos.photo.length);
                const photo = response.photos.photo[randomIndex];
                const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
    
                $(".banner").html(`<img src="${imgUrl}" alt="Advertisement" />`);
            }
        });
    }

});


