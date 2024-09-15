$(document).ready(function () {

    function loadSavedTeams() {
        const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams')) || [];
        const teamsContainer = document.getElementById('saved-teams-container');
    
        // Limpiamos el contenedor antes de cargar los equipos
        teamsContainer.innerHTML = '';
    
        if (savedTeams.length === 0) {
            teamsContainer.innerHTML = '<p>No hay equipos guardados.</p>';
        } else {
            savedTeams.forEach((team, index) => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('team');
    
                const teamTitle = document.createElement('h3');
                teamTitle.innerText = `Equipo ${index + 1}`;
                teamElement.appendChild(teamTitle);
    
                const pokemonList = document.createElement('ul');
                team.forEach(pokemon => {
                    const listItem = document.createElement('li');
                    listItem.innerText = pokemon.name;
                    pokemonList.appendChild(listItem);
                });
    
                // Botón de eliminar equipo
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar equipo';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function() {
                    removeTeam(index);  // Llamar a la función de eliminar equipo
                });
    
                teamElement.appendChild(pokemonList);
                teamElement.appendChild(deleteButton);  // Agregar el botón de eliminar al equipo
                teamsContainer.appendChild(teamElement);
            });
        }
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
    
    loadSavedTeams();
    


});



