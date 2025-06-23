// Permitir letras, espacios, tildes, diéresis, ñ, Ñ y apóstrofes
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ' .-]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(6|7|9)\d{8}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

//Length validations according to the database schema

const isValidName = (name: string) => {
  // Permite letras Unicode, espacios y apóstrofes
  return /^[\p{L} ']+$/u.test(name.normalize('NFC'));
};

const validateName = (name: string) => {
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid name');
    }
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 100 || !NAME_REGEX.test(trimmed)) {
        throw new Error('Invalid name');
    }
};

const validateEmail = (email: string) => {
    if (!email || !EMAIL_REGEX.test(email)) {
        throw new Error('Invalid email');
    }
};

const validatePhone = (phone: string) => {
    if (phone && !PHONE_REGEX.test(phone)) {
        throw new Error('Invalid phone');
    }
};

const isRealDate = (dateString: string) => {
    if (!DATE_REGEX.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Validar rangos básicos
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Crear fecha usando UTC para evitar problemas de zona horaria
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Verificar que la fecha es válida y corresponde a los valores originales
    return date.getUTCFullYear() === year && 
           date.getUTCMonth() === month - 1 && 
           date.getUTCDate() === day;
};

const validateDate = (date?: string | null, required: boolean = true) => {
    if (!date) {
        if (required) {
            throw new Error('Invalid date');
        }
        return; // Si no es requerido y está vacío, no validar
    }
    if (!DATE_REGEX.test(date) || !isRealDate(date)) {
        throw new Error('Invalid date');
    }
};

const validateAddress = (address: string) => {
    if (address && address.length > 100) {
        throw new Error('Invalid address');
    }
};

const validateEducation = (education: any) => {
    if (!education.institution || education.institution.length > 100) {
        throw new Error('Invalid institution');
    }

    // Título: hasta 250 caracteres según el modelo
    if (!education.title || education.title.length > 250) {
        throw new Error('Invalid title');
    }

    validateDate(education.startDate, true); // startDate es requerido
    
    // Validar endDate con mensaje específico (opcional)
    if (education.endDate && (!DATE_REGEX.test(education.endDate) || !isRealDate(education.endDate))) {
        throw new Error('Invalid end date');
    }
};

const validateExperience = (experience: any) => {
    if (!experience.company || experience.company.length > 100) {
        throw new Error('Invalid company');
    }

    if (!experience.position || experience.position.length > 100) {
        throw new Error('Invalid position');
    }

    if (experience.description && experience.description.length > 200) {
        throw new Error('Invalid description');
    }

    validateDate(experience.startDate, true); // startDate es requerido
    
    // Validar endDate con mensaje específico (opcional)
    if (experience.endDate && (!DATE_REGEX.test(experience.endDate) || !isRealDate(experience.endDate))) {
        throw new Error('Invalid end date');
    }
};

const validateCV = (cv: any) => {
    if (typeof cv !== 'object' || !cv.filePath || typeof cv.filePath !== 'string' || !cv.fileType || typeof cv.fileType !== 'string') {
        throw new Error('Invalid CV data');
    }
};

export const validateCandidateData = (data: any) => {
    if (data.id) {
        // If id is provided, we are editing an existing candidate, so fields are not mandatory
        return;
    }

    validateName(data.firstName); 
    validateName(data.lastName); 
    validateEmail(data.email);
    validatePhone(data.phone);
    validateAddress(data.address);

    if (data.educations) {
        for (const education of data.educations) {
            validateEducation(education);
        }
    }

    if (data.workExperiences) {
        for (const experience of data.workExperiences) {
            validateExperience(experience);
        }
    }

    if (data.cv && Object.keys(data.cv).length > 0) {
        validateCV(data.cv);
    }
};