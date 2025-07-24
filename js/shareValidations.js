$(document).ready(function () {
    function clearErrors() {
        $('.error').remove();
    }

    const pkmInfo = JSON.parse(sessionStorage.getItem('pkmShareInfo')) || [];
    const pokemonTypes = pkmInfo[2]?.map(typeObj =>
        typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1).toLowerCase()
    ).join(", ");

    const pokemonName = pkmInfo[0]?.charAt(0).toUpperCase() + pkmInfo[0]?.slice(1).toLowerCase();
    const pokemonID = pkmInfo[1];

    if (pkmInfo.length > 0) {
        const pokemonDesc = pkmInfo[3]?.replace(/\n/g, " ");

        const formattedResult = `Nombre: ${pokemonName}        ID: #${pokemonID}        Tipo: ${pokemonTypes}\n\nDescripción: ${pokemonDesc}`;
        const textarea = document.createElement('textarea');
        textarea.classList.add('sharedResult');
        textarea.name = 'sharedResult';
        textarea.value = formattedResult;
        textarea.readOnly = true;

        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.insertBefore(textarea, resultsContainer.firstChild);
    }

    $('#shareForm').on('submit', function (e) {
        e.preventDefault();
        clearErrors();

        const senderEmail = $('#email').val().trim();
        const receiverEmail = $('#email2').val().trim();
        const message = $('#message').val().trim();

        let isValid = true;

        if (senderEmail === '') {
            showError(document.getElementById('email'), 'El correo del emisor es obligatorio.');
            isValid = false;
        } else if (!validateEmail(senderEmail)) {
            showError(document.getElementById('email'), 'El correo del emisor no es válido.');
            isValid = false;
        }

        if (receiverEmail === '') {
            showError(document.getElementById('email2'), 'El correo del destinatario es obligatorio.');
            isValid = false;
        } else if (!validateEmail(receiverEmail)) {
            showError(document.getElementById('email2'), 'El correo del destinatario no es válido.');
            isValid = false;
        }

        if (senderEmail !== '' && receiverEmail !== '' && senderEmail === receiverEmail) {
            showError(document.getElementById('email2'), 'El correo del destinatario no puede ser igual al del emisor.');
            isValid = false;
        }

        if (isValid) {
            let emailSubject = encodeURIComponent("¡Te comparto los datos del pokémon!");
            let emailBody = message ? `${message}\n\nDatos del pokémon:\n` : `Datos del pokémon:\n`;

            emailBody += `Nombre: ${pokemonName}\nID: #${pokemonID}\nTipo: ${pokemonTypes}\nDescripción: ${pkmInfo[3].replace(/\n/g, " ")}\n\nEnviado desde la Pokédex, por ${senderEmail}`;
            emailBody = encodeURIComponent(emailBody);

            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}&su=${emailSubject}&body=${emailBody}`;
            window.open(gmailLink, '_blank');
        }
    });

    $('#cancelButton').on('click', function () {
        window.history.back();
    });

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function showError(element, message) {

        if (!element) {
            console.error("El elemento no existe o no fue encontrado en el DOM.");
            return;
        }

        element.classList.add('invalid');
    
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        
        errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('error')) {
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
    
        element.addEventListener('focus', () => {
            element.classList.remove('invalid');
            if (element.nextElementSibling && element.nextElementSibling.classList.contains('error')) {
                element.nextElementSibling.remove();
            }
        });
    }
    
});
