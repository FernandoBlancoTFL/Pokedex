$(document).ready(function () {
    const savedTeamsArray = JSON.parse(localStorage.getItem('pokemonTeamsArray')) || [];

    function loadSavedTeams() {
        const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];
        const teamsContainer2 = document.getElementById('saved-teams-container');
    
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
                    
                    teamElement.insertAdjacentHTML('beforeend', newSection);
                });
    
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar equipo';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function() {
                    removeTeam(index);
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
    
        setInterval(function() {
            rotateAngle = direction * 15;
    
            $image.css({
                'transform': 'rotate(' + rotateAngle + 'deg)',
                'transition': 'transform 0.2s ease-in-out'
            });
            direction *= -1;
        }, 500);
    }

    function removeTeam(index) {
        let savedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];
        savedTeams.splice(index, 1);
    
        localStorage.setItem('pokemonTeams', JSON.stringify(savedTeams));
    
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
    
    loadSavedTeams();
    loadAd();
    
});



