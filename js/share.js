document.addEventListener('DOMContentLoaded', function() {
    const shareForm = document.getElementById('shareForm');
    const cancelButton = document.getElementById('cancelButton');

    // Recuperar el array desde sessionStorage y parsearlo a objeto JavaScript
    const pkmInfo = JSON.parse(sessionStorage.getItem('pkmShareInfo')) || [];
    // Convertir la primera letra de cada tipo a mayúscula
    const pokemonTypes = pkmInfo[2].map(typeObj => 
        typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1).toLowerCase()
    ).join(", ");
    const pokemonName = pkmInfo[0].charAt(0).toUpperCase() + pkmInfo[0].slice(1).toLowerCase();
    const pokemonID = pkmInfo[1];

    // Verificar que el array contiene datos
    if (pkmInfo.length > 0) {
        // Eliminar los saltos de línea (\n) de la descripción
        const pokemonDesc = pkmInfo[3].replace(/\n/g, " ");

        // Crear el texto formateado para el textarea
        const formattedResult = `Nombre: ${pokemonName}        ID: #${pokemonID}        Tipo: ${pokemonTypes}\n\nDescripción: ${pokemonDesc}`;

        // Crear un textarea y asignar el valor formateado
        const textarea = document.createElement('textarea');
        textarea.classList.add('sharedResult');
        textarea.name = 'sharedResult';
        textarea.value = formattedResult;
        textarea.readOnly = true;  // Hacer que el textarea sea de solo lectura

        // Añadir el textarea al formulario
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.insertBefore(textarea, resultsContainer.firstChild);
    }

    // Evento para enviar el formulario
    shareForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que se envíe el formulario tradicionalmente

        const email = document.getElementById('email').value;
        const receiverEmail = document.getElementById('email2').value;
        const message = document.getElementById('message').value;

        // Validación para asegurarse de que ambos emails tengan valor
        if (!email || !receiverEmail) {
            //alert("Por favor, rellena ambos correos electrónicos.");
            return; // Detener la ejecución si los emails están vacíos
        }

        // Construimos el contenido del correo
        let emailSubject = encodeURIComponent("¡Te comparto los datos del pokemon!");
        let emailBody = `Datos del pokémon:\n`;
        
        // Recorrer y añadir los resultados compartidos al cuerpo del correo
        pkmInfo.forEach((result, index) => {
            if(index + 1 == 1){
                emailBody += `Nombre: ${pokemonName}\n`;
            } else if(index + 1 == 2){
                emailBody += `ID: #${pokemonID}\n`;
            } else if(index + 1 == 3){
                emailBody += `Tipo: ${pokemonTypes}\n`;
            } else if(index + 1 == 4){
                emailBody += `Descripción: ${result.replace(/\n/g, " ")}\n`;
            }
        });

        if (message) {
            emailBody += `\n${message}\n`;
        }
        
        emailBody += `\nEnviado por ${email}, desde la Pokédex.`;
        emailBody = encodeURIComponent(emailBody);

        // Redirigir a la apertura del cliente de correo
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}&su=${emailSubject}&body=${emailBody}`;
        window.open(gmailLink, '_blank');
    });

    // Evento para cancelar y redirigir a la página anterior
    cancelButton.addEventListener('click', function() {
        window.history.back();
    });
});
