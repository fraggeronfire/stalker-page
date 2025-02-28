const modal = document.getElementById('modal');
const aboutModal = document.getElementById('aboutModal')
const aboutBtn = document.getElementById('aboutBtn')
const registerBtn = document.getElementById('registerBtn');
const closeModal = document.getElementById('closeModal');
const closeAboutModal = document.getElementById('closeAboutModal')
const registerForm = document.getElementById('registerForm');
const checkbox = document.getElementById('agreement');
const checkboxError = document.getElementById('agreement-errors');

aboutBtn.addEventListener('click', () => aboutModal.style.display = "flex")
registerBtn.addEventListener('click', () => modal.style.display = "flex");
closeModal.addEventListener('click', () => modal.style.display = "none");
closeAboutModal.addEventListener('click', () => aboutModal.style.display = "none")

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

window.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
        aboutModal.style.display = "none";
    }
});


class FormValidation {
    selectors = {
        form: '[data-js-form]',
        fieldErrors: '[data-js-form-field-errors]',
    }

    errorMessages = {
        valueMissing: () => 'Please, fill out this field',
        patternMismatch: ({ title }) => title || 'Data does not match format',
        tooShort: ({ minLength }) => `Value too short, min symbols - ${minLength}`,
        tooLong: ({ maxLength }) => `Value too long, symbols limit - ${maxLength}`,
    }

    constructor(){
        this.bindEvents();
    }

    manageErrors(fieldControlElement, errorMessages) {
        const fieldErrorsElement = fieldControlElement.parentElement.querySelector(this.selectors.fieldErrors);
        fieldErrorsElement.innerHTML = errorMessages
           .map((message) => `<span class="field__errors">${message}</span>`)
           .join('');
    }

    validateField(fieldControlElement) {
        const errors = fieldControlElement.validity;
        const errorMessages = [];

        Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
            if (errors[errorType]){
                errorMessages.push(getErrorMessage(fieldControlElement));
            }
        });

        this.manageErrors(fieldControlElement, errorMessages);

        const isValid = errorMessages.length === 0;
        fieldControlElement.ariaInvalid = !isValid;
        return isValid;
    }

    onBlur(event) {
        const { target } = event;
        const isFormField = target.closest(this.selectors.form);
        const isRequired = target.required;

        if(isFormField && isRequired){
            this.validateField(target);
        }
    }

    onChange(event) {
        const { target } = event;
        const isRequired = target.required;
        const isToggleType = ['radio', 'checkbox'].includes(target.type);

        if (isToggleType && isRequired) {
            this.validateField(target);
        }
    }

    onSubmit(event) {
        const isFormElement = event.target.matches(this.selectors.form);

        if(!isFormElement) {
            return;
        }

        const requiredControlElements = [...event.target.elements]
         .filter(({ required }) => required);
        let isFormValid = true;
        let firstInvalidFieldControl = null;

        requiredControlElements.forEach((element) => {
            const isFieldValid = this.validateField(element);

            if (!isFieldValid) {
                isFormValid = false;
                if (!firstInvalidFieldControl){
                    firstInvalidFieldControl = element;
                }
            }
        });

        if (!isFormValid) {
            event.preventDefault();
            firstInvalidFieldControl.focus();
        }
    }

    bindEvents(){
        document.addEventListener('blur', (event) => this.onBlur(event), { capture: true });
        document.addEventListener('change', (event) => this.onChange(event));
        document.addEventListener('submit', (event) => this.onSubmit(event));
    }
}

new FormValidation();



registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!this.checkValidity()) { 
        this.reportValidity(); 
        return;
    }

    if (!checkbox.checked) {
        checkboxError.innerHTML = '<span class="field__error">You must agree with the usage policy</span>';
        return;
    } else {
        checkboxError.innerHTML = '';
    }

    alert("Registration successful!");
    this.reset();
    modal.style.display = "none";
});



document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-btn, .back-btn, .scroll-down-btn, .scroll-up-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSection = document.getElementById(this.getAttribute('data-target'));
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            } else {
                console.error(`Элемент с id '${this.getAttribute('data-target')}' не найден`);
            }
        });
    });



    const bigVideo = document.querySelector('.big-gameplay-video');
    if (bigVideo) bigVideo.play();


    document.querySelectorAll('.gameplay-video').forEach(video => {
        video.addEventListener('mouseenter', () => video.play());
        video.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
});
