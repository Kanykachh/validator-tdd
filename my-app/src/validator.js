// fonctions de validation pour le formulaire d'inscription

// verifie que l'utilisateur a 18 ans ou plus
export function validateAge(birthDate) {
    if (!birthDate || birthDate === '') {
        return { valid: false, error: 'La date de naissance est requise' };
    }

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
        return { valid: false, error: 'Date de naissance invalide' };
    }

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
    }

    if (age < 18) {
        return { valid: false, error: 'Vous devez avoir au moins 18 ans' };
    }

    return { valid: true };
}

// verifie le code postal francais (5 chiffres)
export function validatePostalCode(postalCode) {
    if (!postalCode || postalCode.trim() === '') {
        return { valid: false, error: 'Le code postal est requis' };
    }

    const regex = /^\d{5}$/;
    if (!regex.test(postalCode)) {
        return { valid: false, error: 'Le code postal doit contenir 5 chiffres' };
    }

    return { valid: true };
}

// verifie le nom ou prenom (pas de chiffres, pas de caracteres speciaux bizarres)
export function validateName(name) {
    if (!name || name.trim() === '') {
        return { valid: false, error: 'Ce champ est requis' };
    }

    // on bloque les trucs qui ressemblent a du XSS
    const xssRegex = /<[^>]*>|javascript:|on\w+\s*=|%3C|%3E/i;
    if (xssRegex.test(name)) {
        return { valid: false, error: 'Caracteres non autorisés' };
    }

    // que des lettres, accents, tirets, apostrophes et espaces
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
        return { valid: false, error: 'Le nom ne doit contenir que des lettres' };
    }

    return { valid: true };
}

// verifie l'email
export function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, error: "L'email est requis" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: "L'email n'est pas valide" };
    }

    return { valid: true };
}

// verifie la ville (pareil que le nom en gros)
export function validateCity(city) {
    if (!city || city.trim() === '') {
        return { valid: false, error: 'La ville est requise' };
    }

    const cityRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!cityRegex.test(city)) {
        return { valid: false, error: 'Nom de ville invalide' };
    }

    return { valid: true };
}

// valide tout le formulaire d'un coup, retourne true ou false
export function validateForm(data) {
    const ageResult = validateAge(data.birthDate);
    if (!ageResult.valid) return false;

    const postalResult = validatePostalCode(data.postalCode);
    if (!postalResult.valid) return false;

    const firstNameResult = validateName(data.firstName);
    if (!firstNameResult.valid) return false;

    const lastNameResult = validateName(data.lastName);
    if (!lastNameResult.valid) return false;

    const emailResult = validateEmail(data.email);
    if (!emailResult.valid) return false;

    const cityResult = validateCity(data.city);
    if (!cityResult.valid) return false;

    return true;
}
