document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('form');

    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const birthdate = document.getElementById('birthdate');
    const gender = document.getElementsByName('gender');
    const rating = document.getElementsByName('rating');
    const email = document.getElementById('email');
    const email2 = document.getElementById('email2');
    const comment = document.getElementById('comment');
    const cancelButton = document.querySelector('.cancel');
    const resetButton = document.querySelector('.reset');
    let flag = 0;

    // Elementos del cuadro de diálogo personalizado
    const customConfirm = document.getElementById('custom-confirm');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    form.addEventListener('submit', function(event) {
        
        // Previene el envío del formulario para poder validar los datos primero (se queda estático)
        event.preventDefault();

        if (firstName && lastName && birthdate && gender && rating && comment) {
            // Valida que los campos obligatorios no estén vacíos
            if (!validateEmptyField(firstName.value, 'Nombre')) return;
            if (!validateEmptyField(lastName.value, 'Apellido')) return;
            if (!validateEmptyField(birthdate.value, 'Fecha de Nacimiento')) return;
            if (!validateSelection(gender, 'Sexo')) return;
            if (!validateSelection(rating, 'Valoración de la página')) return;
            
            // Validación de nombre y apellido (solo letras)
            if (!validateNameSurname(firstName.value, 'Nombre')) return;
            if (!validateNameSurname(lastName.value, 'Apellido')) return;

            // Validar formato de la fecha de nacimiento
            if (!validateBirthdate(birthdate.value)) return;
        } else {
            flag = 1;
        }

        // Validaciones del email (se ejecutan siempre)
        if (!validateEmptyField(email.value, 'Email')) return;
        if (!validateEmail(email.value)) return;

        if (!validateEmptyField(email2.value, 'Email')) return;
        if (!validateEmail(email2.value)) return;

        // ****** Recopilar los datos del formulario ******

        let genderValue = '';
        let ratingValue = '';

        // Obtengo que opción se selecciono y la coloco en un string
        gender.forEach(option => {
            if (option.checked) genderValue = option.nextSibling.textContent.trim();
        });
        
        rating.forEach(option => {
            if (option.checked) ratingValue = option.nextSibling.textContent.trim();
        });

        if(flag == 0){
            // Recopilo los datos del formulario en una cadena de texto
            const formData = `
                Nombre: ${firstName.value}
                Apellido: ${lastName.value}
                Fecha de Nacimiento: ${birthdate.value}
                Sexo: ${genderValue}
                Valoración de la página: ${ratingValue}
                Email: ${email.value}
                Comentario: ${comment.value}
            `;

            // Muestro una alerta con los datos del formulario
            alert('Datos del formulario:\n' + formData);
        }

        
        console.log("Formulario enviado");
        // Si todas las validaciones pasan, muestra un mensaje y envía el formulario
        alert('Formulario enviado correctamente.');
        form.submit();
    });

    if (cancelButton || confirmYes || confirmNo || resetButton){
        // Evento para el botón "Cancelar"
        cancelButton.addEventListener('click', function() {
            customConfirm.style.display = 'flex'; // Muestra el cuadro de diálogo personalizado
        });

        // Evento para el botón Sí
        confirmYes.addEventListener('click', function() {
            window.history.back(); // Vuelve a la página anterior
        });

        // Evento para el botón No
        confirmNo.addEventListener('click', function() {
            customConfirm.style.display = 'none'; // So oculta el cuadro de diálogo
        });

        // Evento para el botón "Restablecer valores"
        resetButton.addEventListener('click', function(event) {
            event.preventDefault(); // Este `preventDefault` evita que el formulario intente enviarse
            form.reset();
        });
    }

    // Función para validar que un campo no esté vacío
    function validateEmptyField(value, field) {
        if (value.trim() === '') {
            alert(`El campo ${field} es obligatorio.`);
            return false;
        }
        return true;
    }

    // Función para validar que se haya seleccionado una opción en un grupo de radio buttons
    function validateSelection(elements, field) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].checked) {
                return true; // Retorna verdadero si alguna opción está seleccionada
            }
        }
        alert(`Debe seleccionar una opción en el campo ${field}.`);
        return false;
    }

    // Función para validar que el formato de nombre y apellido sea correcto (solo letras)
    function validateNameSurname(value, field) {
        const regex = /^[a-zA-Z]+$/; // Expresión regular que solo permite letras
        if (!regex.test(value.trim())) {
            alert(`El campo ${field} solo puede contener letras de la 'a' a la 'z' y de la 'A' a la 'Z'.`);
            return false;
        }
        return true;
    }

    // Función para validar el formato de la fecha de nacimiento ('dd-mm-yyyy')
    function validateBirthdate(inputDate) {
        console.log("La fecha tiene formato: " + inputDate);

        // La fecha que llega está en formato 'aaaa-mm-dd'
        const regexDate = /^\d{4}-\d{2}-\d{2}$/;
    
        // Verifico si la fecha ingresada coincide con el formato aaaa-mm-dd
        if (!regexDate.test(inputDate)) {
            alert('La fecha de nacimiento debe tener el formato aaaa-mm-dd.');
            return false;
        }
    
        // Divido la fecha en partes: aaaa, mm, dd y las coloca en un array
        const [year, month, day] = inputDate.split('-');
    
        // Verificar que las partes de la fecha son válidas
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() != year ||
            date.getMonth() + 1 != month ||
            date.getDate() != day
        ) {
            alert('Fecha de nacimiento no es válida.');
            return false;
        }
    
        // Convierto la fecha de aaaa-mm-dd a dd-mm-aaaa
        const convertedDate = `${day}-${month}-${year}`;
    
        // Expresión regular para validar el formato dd-mm-aaaa
        const regexConverted = /^\d{2}-\d{2}-\d{4}$/;
    
        // Verifico que la fecha convertida coincide con el formato dd-mm-aaaa
        if (!regexConverted.test(convertedDate)) {
            alert('La fecha de nacimiento convertida no tiene el formato dd-mm-aaaa.');
            return false;
        }
    
        return true;
    }

    // Función para validar el formato del email
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.trim())) {
            alert('El email debe tener un formato correcto.');
            return false;
        }
        return true;
    }

    // Evento de cambio de imágenes del formulario
    const images = ["https://archive.org/download/1697331700298/1697331700298.jpg", "https://ia600502.us.archive.org/16/items/1697331700298/1697331705064.jpg", "https://ia600502.us.archive.org/16/items/1697331700298/1697331710942.jpg", "https://ia800502.us.archive.org/16/items/1697331700298/1697331284995.jpg"];

    const element = document.getElementById('surveyID');

    // Función para elegir un elemento al azar del array
    function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex]; // Retorna el elemento del array
    }

    if(element){
        // Asigno la imagen aleatoria como fondo del elemento
        element.style.backgroundImage = `url(${getRandomImage()})`;
    }

});
