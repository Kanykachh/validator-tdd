/**
 * @module validator
 * @description Module de validation des données utilisateur
 * @version 1.0.0
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Indique si la validation a réussi
 * @property {number} [age] - L'âge calculé
 * @property {string} [postalCode] - Le code postal validé
 * @property {string} [firstName] - Le prénom validé
 * @property {string} [lastName] - Le nom validé
 * @property {string} [email] - L'email validé
 * @property {ValidationError} [error] - L'erreur de validation
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} code - Code d'erreur
 * @property {string} message - Message d'erreur
 */

/**
 * Valide l'âge d'une personne (doit être >= 18 ans)
 *
 * @param {Date} birthDate - Date de naissance
 * @returns {ValidationResult} Résultat de la validation
 * @throws {Error} INVALID_DATE si la date est invalide
 * @throws {Error} FUTURE_DATE si la date est dans le futur
 */
function validateAge(birthDate) {
    if (birthDate === null || birthDate === undefined) {
        throw new Error('INVALID_DATE');
    }

    if (!(birthDate instanceof Date)) {
        throw new Error('INVALID_DATE');
    }

    if (isNaN(birthDate.getTime())) {
        throw new Error('INVALID_DATE');
    }

    const today = new Date();
    if (birthDate > today) {
        throw new Error('FUTURE_DATE');
    }

    // Calcul de l'âge
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    if (age < 18) {
        return {
            valid: false,
            age: age,
            error: {
                code: 'AGE_UNDER_18',
                message: `L'utilisateur a ${age} ans. L'âge minimum requis est de 18 ans.`
            }
        };
    }

    return {
        valid: true,
        age: age
    };
}

/**
 * Valide un code postal français (5 chiffres)
 *
 * @param {string} postalCode - Code postal à valider
 * @returns {ValidationResult} Résultat de la validation
 * @throws {Error} INVALID_INPUT si l'entrée est invalide
 */
function validatePostalCode(postalCode) {
    if (postalCode === null || postalCode === undefined) {
        throw new Error('INVALID_INPUT');
    }

    if (typeof postalCode !== 'string') {
        throw new Error('INVALID_INPUT');
    }

    if (postalCode.trim() === '') {
        throw new Error('INVALID_INPUT');
    }

    const postalCodeRegex = /^\d{5}$/;

    if (!postalCodeRegex.test(postalCode)) {
        return {
            valid: false,
            error: {
                code: 'INVALID_FORMAT',
                message: 'Le code postal doit contenir exactement 5 chiffres.'
            }
        };
    }

    return {
        valid: true,
        postalCode: postalCode
    };
}

/**
 * Valide le nom et prénom (pas de chiffres, protection XSS)
 *
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom de famille
 * @returns {ValidationResult} Résultat de la validation
 * @throws {Error} INVALID_INPUT si les entrées sont invalides
 */
function validateIdentity(firstName, lastName) {
    if (firstName === null || firstName === undefined ||
        lastName === null || lastName === undefined) {
        throw new Error('INVALID_INPUT');
    }

    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
        throw new Error('INVALID_INPUT');
    }

    if (firstName.trim() === '' || lastName.trim() === '') {
        throw new Error('INVALID_INPUT');
    }

    // Detection XSS
    const xssPatterns = [
        /<[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /%3C/i,
        /%3E/i,
        /&lt;/i,
        /&gt;/i,
        /expression\s*\(/i,
        /url\s*\(/i
    ];

    for (const pattern of xssPatterns) {
        if (pattern.test(firstName) || pattern.test(lastName)) {
            return {
                valid: false,
                error: {
                    code: 'XSS_DETECTED',
                    message: 'Tentative d\'injection XSS détectée.'
                }
            };
        }
    }

    // Regex pour noms valides (lettres, accents, tirets, apostrophes)
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u024F\u1E00-\u1EFF\s'\-]+$/;

    if (!nameRegex.test(firstName)) {
        return {
            valid: false,
            error: {
                code: 'INVALID_CHARACTERS',
                message: 'Le prénom contient des caractères non autorisés.'
            }
        };
    }

    if (!nameRegex.test(lastName)) {
        return {
            valid: false,
            error: {
                code: 'INVALID_CHARACTERS',
                message: 'Le nom contient des caractères non autorisés.'
            }
        };
    }

    return {
        valid: true,
        firstName: firstName,
        lastName: lastName
    };
}

/**
 * Valide un email
 *
 * @param {string} email - Email à valider
 * @returns {ValidationResult} Résultat de la validation
 * @throws {Error} INVALID_INPUT si l'entrée est invalide
 */
function validateEmail(email) {
    if (email === null || email === undefined) {
        throw new Error('INVALID_INPUT');
    }

    if (typeof email !== 'string') {
        throw new Error('INVALID_INPUT');
    }

    if (email.trim() === '') {
        throw new Error('INVALID_INPUT');
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailRegex.test(email)) {
        return {
            valid: false,
            error: {
                code: 'INVALID_FORMAT',
                message: 'Le format de l\'email est invalide.'
            }
        };
    }

    return {
        valid: true,
        email: email
    };
}

module.exports = {
    validateAge,
    validatePostalCode,
    validateIdentity,
    validateEmail
};
