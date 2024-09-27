document.addEventListener('DOMContentLoaded', function() {
    const shareForm = document.getElementById('shareForm');
    const cancelButton = document.getElementById('cancelButton');

    // Obtengo el array desde sessionStorage y lo parseo a objeto JavaScript
    const pkmInfo = JSON.parse(sessionStorage.getItem('pkmShareInfo')) || [];

    // Convierto la primera letra de cada tipo a mayúscula
    const pokemonTypes = pkmInfo[2].map(typeObj => 
        typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1).toLowerCase()
    ).join(", ");

    const pokemonName = pkmInfo[0].charAt(0).toUpperCase() + pkmInfo[0].slice(1).toLowerCase();
    const pokemonID = pkmInfo[1];

    // Verifico que el array contenga datos
    if (pkmInfo.length > 0) {

        // Elimino los saltos de línea (\n) de la descripción
        const pokemonDesc = pkmInfo[3].replace(/\n/g, " ");

        // Creo el texto
        const formattedResult = `Nombre: ${pokemonName}        ID: #${pokemonID}        Tipo: ${pokemonTypes}\n\nDescripción: ${pokemonDesc}`;

        // Creo un textarea y asigno el valor formateado
        const textarea = document.createElement('textarea');
        textarea.classList.add('sharedResult');
        textarea.name = 'sharedResult';
        textarea.value = formattedResult;
        textarea.readOnly = true;  // textarea de solo lectura

        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.insertBefore(textarea, resultsContainer.firstChild); // Agrego el textarea al contenedor
    }

    // Evento para enviar el formulario
    shareForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evito que se envíe el formulario para validaciones

        const email = document.getElementById('email').value;
        const receiverEmail = document.getElementById('email2').value;
        const message = document.getElementById('message').value;

        // Validación para asegurarse de que ambos emails tengan valor, si no tienen valor termina la ejecucion
        if (!email || !receiverEmail) {
            return;
        } else {
            if (!validateEmail(email)) return;
            if (!validateEmail(receiverEmail)) return;
        }

        // Construccion del contenido del correo
        let emailSubject = encodeURIComponent("¡Te comparto los datos del pokemon!");

        let emailBody = ``;
        
        if (message) {
            emailBody += `${message}\n`;
            emailBody += `\nDatos del pokémon:\n`;
        } else{
            emailBody += `Datos del pokémon:\n`;
        }

        // Recorrer y añadir los resultados compartidos al cuerpo del correo
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

        // Redirijo al cliente de correo
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

    // Evento para cancelar y redirigir a la página anterior
    cancelButton.addEventListener('click', function() {
        window.history.back();
    });
});
