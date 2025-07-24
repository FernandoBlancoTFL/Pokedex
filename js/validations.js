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

    const customConfirm = document.getElementById('custom-confirm');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    form.addEventListener('submit', function(event) {
        
        event.preventDefault();

        if (firstName && lastName && birthdate && gender && rating && comment) {
            if (!validateEmptyField(firstName.value, 'Nombre')) return;
            if (!validateEmptyField(lastName.value, 'Apellido')) return;
            if (!validateEmptyField(birthdate.value, 'Fecha de Nacimiento')) return;
            if (!validateSelection(gender, 'Sexo')) return;
            if (!validateSelection(rating, 'Valoración de la página')) return;
            
            if (!validateNameSurname(firstName.value, 'Nombre')) return;
            if (!validateNameSurname(lastName.value, 'Apellido')) return;

            if (!validateBirthdate(birthdate.value)) return;
        } else {
            flag = 1;
        }

        if (!validateEmptyField(email.value, 'Email')) return;
        if (!validateEmail(email.value)) return;

        if (!validateEmptyField(email2.value, 'Email')) return;
        if (!validateEmail(email2.value)) return;


        let genderValue = '';
        let ratingValue = '';

        gender.forEach(option => {
            if (option.checked) genderValue = option.nextSibling.textContent.trim();
        });
        
        rating.forEach(option => {
            if (option.checked) ratingValue = option.nextSibling.textContent.trim();
        });

        if(flag == 0){
            const formData = `
                Nombre: ${firstName.value}
                Apellido: ${lastName.value}
                Fecha de Nacimiento: ${birthdate.value}
                Sexo: ${genderValue}
                Valoración de la página: ${ratingValue}
                Email: ${email.value}
                Comentario: ${comment.value}
            `;

            alert('Datos del formulario:\n' + formData);
        }

        
        console.log("Formulario enviado");
        alert('Formulario enviado correctamente.');
        form.submit();
    });

    if (cancelButton || confirmYes || confirmNo || resetButton){
        cancelButton.addEventListener('click', function() {
            customConfirm.style.display = 'flex';
        });

        confirmYes.addEventListener('click', function() {
            window.history.back();
        });

        confirmNo.addEventListener('click', function() {
            customConfirm.style.display = 'none';
        });

        resetButton.addEventListener('click', function(event) {
            event.preventDefault();
            form.reset();
        });
    }

    function validateEmptyField(value, field) {
        if (value.trim() === '') {
            alert(`El campo ${field} es obligatorio.`);
            return false;
        }
        return true;
    }

    function validateSelection(elements, field) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].checked) {
                return true;
            }
        }
        alert(`Debe seleccionar una opción en el campo ${field}.`);
        return false;
    }

    function validateNameSurname(value, field) {
        const regex = /^[a-zA-Z]+$/;
        if (!regex.test(value.trim())) {
            alert(`El campo ${field} solo puede contener letras de la 'a' a la 'z' y de la 'A' a la 'Z'.`);
            return false;
        }
        return true;
    }

    function validateBirthdate(inputDate) {
        console.log("La fecha tiene formato: " + inputDate);

        const regexDate = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!regexDate.test(inputDate)) {
            alert('La fecha de nacimiento debe tener el formato aaaa-mm-dd.');
            return false;
        }
    
        const [year, month, day] = inputDate.split('-');
    
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() != year ||
            date.getMonth() + 1 != month ||
            date.getDate() != day
        ) {
            alert('Fecha de nacimiento no es válida.');
            return false;
        }
    
        const convertedDate = `${day}-${month}-${year}`;
    
        const regexConverted = /^\d{2}-\d{2}-\d{4}$/;
    
        if (!regexConverted.test(convertedDate)) {
            alert('La fecha de nacimiento convertida no tiene el formato dd-mm-aaaa.');
            return false;
        }
    
        return true;
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.trim())) {
            alert('El email debe tener un formato correcto.');
            return false;
        }
        return true;
    }

    const images = ["https://archive.org/download/1697331700298/1697331700298.jpg", "https://ia600502.us.archive.org/16/items/1697331700298/1697331705064.jpg", "https://ia600502.us.archive.org/16/items/1697331700298/1697331710942.jpg", "https://ia800502.us.archive.org/16/items/1697331700298/1697331284995.jpg"];

    const element = document.getElementById('surveyID');

    function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    if(element){
        element.style.backgroundImage = `url(${getRandomImage()})`;
    }

});
