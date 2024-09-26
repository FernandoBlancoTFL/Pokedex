$(document).ready(function () {
    // Borra todos los errores visibles en el formulario
    function clearErrors() {
        $('.error').remove();
    }

    // Recupera la información del Pokémon desde sessionStorage
    const pkmInfo = JSON.parse(sessionStorage.getItem('pkmShareInfo')) || [];
    const pokemonTypes = pkmInfo[2]?.map(typeObj =>
        typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1).toLowerCase()
    ).join(", ");

    const pokemonName = pkmInfo[0]?.charAt(0).toUpperCase() + pkmInfo[0]?.slice(1).toLowerCase();
    const pokemonID = pkmInfo[1];

    // Si hay datos en sessionStorage, construye el texto formateado y lo agrega al formulario
    if (pkmInfo.length > 0) {
        const pokemonDesc = pkmInfo[3]?.replace(/\n/g, " ");

        const formattedResult = `Nombre: ${pokemonName}        ID: #${pokemonID}        Tipo: ${pokemonTypes}\n\nDescripción: ${pokemonDesc}`;
        const textarea = document.createElement('textarea');
        textarea.classList.add('sharedResult');
        textarea.name = 'sharedResult';
        textarea.value = formattedResult;
        textarea.readOnly = true;  // Campo de solo lectura

        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.insertBefore(textarea, resultsContainer.firstChild); // Agrega el textarea
    }

    // Manejo del evento submit
    $('#shareForm').on('submit', function (e) {
        e.preventDefault();
        clearErrors();

        const senderEmail = $('#email').val().trim();
        const receiverEmail = $('#email2').val().trim();
        const message = $('#message').val().trim();

        let isValid = true;

        // Validación de los emails
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

        // Verificación de que ambos correos no sean iguales
        if (senderEmail !== '' && receiverEmail !== '' && senderEmail === receiverEmail) {
            showError(document.getElementById('email2'), 'El correo del destinatario no puede ser igual al del emisor.');
            isValid = false;
        }

        // Si el formulario es válido, procede con el envío
        if (isValid) {
            // Construcción del cuerpo del correo
            let emailSubject = encodeURIComponent("¡Te comparto los datos del pokémon!");
            let emailBody = message ? `${message}\n\nDatos del pokémon:\n` : `Datos del pokémon:\n`;

            // Añadir información del Pokémon al cuerpo del correo
            emailBody += `Nombre: ${pokemonName}\nID: #${pokemonID}\nTipo: ${pokemonTypes}\nDescripción: ${pkmInfo[3].replace(/\n/g, " ")}\n\nEnviado desde la Pokédex, por ${senderEmail}`;
            emailBody = encodeURIComponent(emailBody);

            // Redirección al cliente de correo
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}&su=${emailSubject}&body=${emailBody}`;
            window.open(gmailLink, '_blank');
        }
    });

    // Evento para cancelar el envío y volver a la página anterior
    $('#cancelButton').on('click', function () {
        window.history.back();
    });

    // Función para validar el email con expresión regular
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Función que agrega vibración
    function addShakeEffect(element) {
        element.classList.remove('shake'); // Remover para reiniciar la animación
        void element.offsetWidth; // Forzar reflow para reiniciar la animación
        element.classList.add('shake'); // Agregar la clase de nuevo
    }

    // Muestra el mensaje de error debajo del campo correspondiente
    // function showError(inputId, message) {
    //     const inputField = $(`#${inputId}`);
    //     inputField.next('.error').remove();
    //     inputField.after(`<span class="error" style="color: red;">${message}</span>`);
    // }

    function showError(element, message) {

        // Verifico que el elemento exista
        if (!element) {
            console.error("El elemento no existe o no fue encontrado en el DOM.");
            return;
        }

        // Añadir la clase de campo inválido (para el borde rojo y vibración)
        element.classList.add('invalid');
    
        // Crear el mensaje de error si no existe
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        
        // Añadir el ícono de alerta de Font Awesome
        errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        // Insertar el mensaje de error después del campo
        if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('error')) {
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
    
        // Eliminar el borde rojo y el mensaje de error al hacer clic en el campo
        element.addEventListener('focus', () => {
            element.classList.remove('invalid');
            if (element.nextElementSibling && element.nextElementSibling.classList.contains('error')) {
                element.nextElementSibling.remove();
            }
        });
    }
    
});
