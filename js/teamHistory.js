$(document).ready(function () {
    const savedTeamsArray = JSON.parse(localStorage.getItem('pokemonTeamsArray')) || [];

    function loadSavedTeams() {
        //localStorage.removeItem('pokemonTeamsArray');
        const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];
        const teamsContainer2 = document.getElementById('saved-teams-container');
    
        // Limpiamos el contenedor antes de cargar los equipos
        teamsContainer2.innerHTML = '';
    
        if (savedTeams.length === 0) {
            teamsContainer2.innerHTML = '<p>No hay equipos guardados.</p>';
        } else {
            savedTeams.forEach((team, index) => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('team');
    
                const teamTitle = document.createElement('h3');
                teamTitle.innerText = `Equipo ${index + 1}`;
                teamElement.appendChild(teamTitle);
    
                team.forEach(pokemon => {

                    let newSection = `
                        <section class="pokemon-entry teamColor">
                            <img class="pkm-img" id="pkm-img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Ícono personalizado">
                            <p id="pkmName" class="pkmName">${pokemon.name}</p>
                            <img class="pokemon-gif" src="${pokemon.gif}">
                        </section>
                    `;
                    
                    // Inserta HTML como HTML real, no texto
                    teamElement.insertAdjacentHTML('beforeend', newSection);
                });
    
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar equipo';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function() {
                    removeTeam(index); // Llamar a la función de eliminar equipo
                });
    
                teamElement.appendChild(deleteButton);
                teamsContainer2.appendChild(teamElement);

                animatePokemonImage($('.pkm-img'));
            });
        }
    }

    function animatePokemonImage($image) {
        let rotateAngle = 15;
        let direction = 1;
    
        // Bucle para crear la animación con setInterval
        setInterval(function() {
            // Cambiar el ángulo de rotación en función de la dirección
            rotateAngle = direction * 15;
    
            // Animar usando .css() directamente para modificar el 'transform'
            $image.css({
                'transform': 'rotate(' + rotateAngle + 'deg)',
                'transition': 'transform 0.2s ease-in-out' // Transición suave
            });
    
            // Cambiar de dirección después de la animación
            direction *= -1;
        }, 500); // Intervalo de 500 ms
    }

    function findPokemonGifByID(idPokemon) {
        let foundPokemon = savedTeamsArray.find(pokemon => pokemon.id === idPokemon);
        return foundPokemon.sprites.other['showdown'].front_default;
    }

    function removeTeam(index) {
        // Obtener los equipos guardados del localStorage
        let savedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];
    
        // Eliminar el equipo seleccionado del array
        savedTeams.splice(index, 1);
    
        // Actualizar el localStorage con el nuevo array de equipos
        localStorage.setItem('pokemonTeams', JSON.stringify(savedTeams));
    
        // Recargar los equipos para actualizar la interfaz
        loadSavedTeams();
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
    
    loadSavedTeams();
    loadAd();
    


});



