document.addEventListener('DOMContentLoaded', function() {
    const shareForm = document.getElementById('shareForm');
    const cancelButton = document.getElementById('cancelButton');

    const pkmInfo = JSON.parse(sessionStorage.getItem('pkmShareInfo')) || [];

    const pokemonTypes = pkmInfo[2].map(typeObj => 
        typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1).toLowerCase()
    ).join(", ");

    const pokemonName = pkmInfo[0].charAt(0).toUpperCase() + pkmInfo[0].slice(1).toLowerCase();
    const pokemonID = pkmInfo[1];

    if (pkmInfo.length > 0) {

        const pokemonDesc = pkmInfo[3].replace(/\n/g, " ");

        const formattedResult = `Nombre: ${pokemonName}        ID: #${pokemonID}        Tipo: ${pokemonTypes}\n\nDescripción: ${pokemonDesc}`;

        const textarea = document.createElement('textarea');
        textarea.classList.add('sharedResult');
        textarea.name = 'sharedResult';
        textarea.value = formattedResult;
        textarea.readOnly = true;

        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.insertBefore(textarea, resultsContainer.firstChild);
    }

    shareForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const receiverEmail = document.getElementById('email2').value;
        const message = document.getElementById('message').value;

        if (!email || !receiverEmail) {
            return;
        } else {
            if (!validateEmail(email)) return;
            if (!validateEmail(receiverEmail)) return;
        }

        let emailSubject = encodeURIComponent("¡Te comparto los datos del pokemon!");

        let emailBody = ``;
        
        if (message) {
            emailBody += `${message}\n`;
            emailBody += `\nDatos del pokémon:\n`;
        } else{
            emailBody += `Datos del pokémon:\n`;
        }

        pkmInfo.forEach((result, index) => {
            if(index + 1 == 1){
                emailBody += `\nNombre: ${pokemonName}\n`;
            } else if(index + 1 == 2){
                emailBody += `ID: #${pokemonID}\n`;
            } else if(index + 1 == 3){
                emailBody += `Tipo: ${pokemonTypes}\n`;
            } else if(index + 1 == 4){
                emailBody += `Descripción: ${result.replace(/\n/g, " ")}\n`;
            }
        });

        emailBody += `\nEnviado desde la Pokédex, por ${email}`;


        emailBody = encodeURIComponent(emailBody);

        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}&su=${emailSubject}&body=${emailBody}`;
        window.open(gmailLink, '_blank');
    });

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.trim())) {
            return false;
        }
        return true;
    }
    cancelButton.addEventListener('click', function() {
        window.history.back();
    });
});
