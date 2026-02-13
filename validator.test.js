const {
    validateAge,
    validatePostalCode,
    validateIdentity,
    validateEmail,
    validateUser
} = require('./validator');

/**
 * Tests unitaires pour validator.js
 */

describe('validateAge', () => {

    describe('Cas valides', () => {
        it('doit valider une personne de 18 ans exactement', () => {
            const today = new Date();
            const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
            expect(result.age).toBe(18);
        });

        it('doit valider une personne de plus de 18 ans', () => {
            const birthDate = new Date('1990-05-15');
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
            expect(result.age).toBeGreaterThan(18);
        });

        it('doit valider une personne agée', () => {
            const today = new Date();
            const birthDate = new Date(today.getFullYear() - 100, 0, 1);
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });
    });

    describe('Cas invalides - mineurs', () => {
        it('doit rejeter une personne de moins de 18 ans', () => {
            const today = new Date();
            const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
            const result = validateAge(birthDate);
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('AGE_UNDER_18');
        });

        it('doit rejeter un nouveau-né', () => {
            const birthDate = new Date();
            const result = validateAge(birthDate);
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('AGE_UNDER_18');
        });

        it('doit rejeter quelqu\'un qui aura 18 ans demain', () => {
            const today = new Date();
            const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
            const result = validateAge(birthDate);
            expect(result.valid).toBe(false);
        });
    });

    describe('29 février - année bissextile', () => {
        it('doit gérer une naissance le 29 février', () => {
            const birthDate = new Date('2000-02-29');
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });

        it('doit calculer correctement l\'age pour le 29 février 2004', () => {
            const birthDate = new Date('2004-02-29');
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });
    });

    describe('Entrées invalides', () => {
        it('doit lever une erreur si pas d\'argument', () => {
            expect(() => validateAge()).toThrow();
        });

        it('doit lever une erreur si null', () => {
            expect(() => validateAge(null)).toThrow('INVALID_DATE');
        });

        it('doit lever une erreur si undefined', () => {
            expect(() => validateAge(undefined)).toThrow('INVALID_DATE');
        });

        it('doit lever une erreur si ce n\'est pas une Date', () => {
            expect(() => validateAge('1990-01-01')).toThrow('INVALID_DATE');
            expect(() => validateAge(123456)).toThrow('INVALID_DATE');
            expect(() => validateAge({})).toThrow('INVALID_DATE');
        });

        it('doit lever une erreur si Date invalide', () => {
            expect(() => validateAge(new Date('invalid'))).toThrow('INVALID_DATE');
        });

        it('doit lever une erreur si date dans le futur', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            expect(() => validateAge(futureDate)).toThrow('FUTURE_DATE');
        });
    });
});

describe('validatePostalCode', () => {

    describe('Codes postaux valides', () => {
        it('doit valider 75001 (Paris)', () => {
            const result = validatePostalCode('75001');
            expect(result.valid).toBe(true);
            expect(result.postalCode).toBe('75001');
        });

        it('doit valider 13001 (Marseille)', () => {
            const result = validatePostalCode('13001');
            expect(result.valid).toBe(true);
        });

        it('doit valider un code commençant par 0', () => {
            const result = validatePostalCode('01000');
            expect(result.valid).toBe(true);
        });

        it('doit valider les DOM-TOM', () => {
            const result = validatePostalCode('97400');
            expect(result.valid).toBe(true);
        });

        it('doit valider la Corse', () => {
            const result = validatePostalCode('20000');
            expect(result.valid).toBe(true);
        });
    });

    describe('Codes postaux invalides', () => {
        it('doit rejeter moins de 5 chiffres', () => {
            const result = validatePostalCode('7500');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('INVALID_FORMAT');
        });

        it('doit rejeter plus de 5 chiffres', () => {
            const result = validatePostalCode('750001');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter les lettres', () => {
            const result = validatePostalCode('7500A');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter les caractères spéciaux', () => {
            const result = validatePostalCode('75-001');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter les espaces', () => {
            const result = validatePostalCode('75 001');
            expect(result.valid).toBe(false);
        });
    });

    describe('Entrées invalides', () => {
        it('doit lever une erreur sans argument', () => {
            expect(() => validatePostalCode()).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si null', () => {
            expect(() => validatePostalCode(null)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si undefined', () => {
            expect(() => validatePostalCode(undefined)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si nombre', () => {
            expect(() => validatePostalCode(75001)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si chaine vide', () => {
            expect(() => validatePostalCode('')).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si objet', () => {
            expect(() => validatePostalCode({})).toThrow('INVALID_INPUT');
        });
    });
});

describe('validateIdentity', () => {

    describe('Noms valides', () => {
        it('doit valider un nom simple', () => {
            const result = validateIdentity('Jean', 'Dupont');
            expect(result.valid).toBe(true);
            expect(result.firstName).toBe('Jean');
            expect(result.lastName).toBe('Dupont');
        });

        it('doit valider les accents', () => {
            const result = validateIdentity('Hélène', 'Müller');
            expect(result.valid).toBe(true);
        });

        it('doit valider les tirets', () => {
            const result = validateIdentity('Jean-Pierre', 'Martin-Dupont');
            expect(result.valid).toBe(true);
        });

        it('doit valider les apostrophes', () => {
            const result = validateIdentity("Patrick", "O'Brien");
            expect(result.valid).toBe(true);
        });

        it('doit valider les espaces', () => {
            const result = validateIdentity('Marie Anne', 'De La Fontaine');
            expect(result.valid).toBe(true);
        });

        it('doit valider les caractères accentués variés', () => {
            const result = validateIdentity('Bérénice', 'Çağlar');
            expect(result.valid).toBe(true);
        });
    });

    describe('Caractères interdits', () => {
        it('doit rejeter les chiffres dans le prénom', () => {
            const result = validateIdentity('Jean123', 'Dupont');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('INVALID_CHARACTERS');
        });

        it('doit rejeter les caractères spéciaux', () => {
            const result = validateIdentity('Jean@', 'Dupont');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter les chiffres dans le nom', () => {
            const result = validateIdentity('Jean', 'Dupont123');
            expect(result.valid).toBe(false);
        });
    });

    describe('Protection XSS', () => {
        it('doit rejeter les balises script', () => {
            const result = validateIdentity('<script>alert("xss")</script>', 'Dupont');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('XSS_DETECTED');
        });

        it('doit rejeter les balises img', () => {
            const result = validateIdentity('Jean', '<img src=x onerror=alert(1)>');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('XSS_DETECTED');
        });

        it('doit rejeter onclick', () => {
            const result = validateIdentity('Jean onclick=alert(1)', 'Dupont');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('XSS_DETECTED');
        });

        it('doit rejeter javascript:', () => {
            const result = validateIdentity('javascript:alert(1)', 'Dupont');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('XSS_DETECTED');
        });

        it('doit rejeter les caractères encodés', () => {
            const result = validateIdentity('Jean', '%3Cscript%3E');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('XSS_DETECTED');
        });
    });

    describe('Entrées invalides', () => {
        it('doit lever une erreur sans arguments', () => {
            expect(() => validateIdentity()).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si prénom null', () => {
            expect(() => validateIdentity(null, 'Dupont')).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si nom null', () => {
            expect(() => validateIdentity('Jean', null)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si prénom vide', () => {
            expect(() => validateIdentity('', 'Dupont')).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si nom vide', () => {
            expect(() => validateIdentity('Jean', '')).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si nombres', () => {
            expect(() => validateIdentity(123, 456)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si objets', () => {
            expect(() => validateIdentity({}, {})).toThrow('INVALID_INPUT');
        });
    });
});

describe('validateEmail', () => {

    describe('Emails valides', () => {
        it('doit valider un email standard', () => {
            const result = validateEmail('user@example.com');
            expect(result.valid).toBe(true);
            expect(result.email).toBe('user@example.com');
        });

        it('doit valider un email avec sous-domaine', () => {
            const result = validateEmail('user@mail.example.com');
            expect(result.valid).toBe(true);
        });

        it('doit valider un email avec points', () => {
            const result = validateEmail('john.doe@example.com');
            expect(result.valid).toBe(true);
        });

        it('doit valider un email avec +', () => {
            const result = validateEmail('user+tag@example.com');
            expect(result.valid).toBe(true);
        });

        it('doit valider un email avec chiffres', () => {
            const result = validateEmail('user123@example123.com');
            expect(result.valid).toBe(true);
        });

        it('doit valider un email avec tiret dans le domaine', () => {
            const result = validateEmail('user@my-company.com');
            expect(result.valid).toBe(true);
        });

        it('doit valider différents TLD', () => {
            expect(validateEmail('user@example.fr').valid).toBe(true);
            expect(validateEmail('user@example.co.uk').valid).toBe(true);
            expect(validateEmail('user@example.io').valid).toBe(true);
        });
    });

    describe('Emails invalides', () => {
        it('doit rejeter sans @', () => {
            const result = validateEmail('userexample.com');
            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('INVALID_FORMAT');
        });

        it('doit rejeter sans domaine', () => {
            const result = validateEmail('user@');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter sans partie locale', () => {
            const result = validateEmail('@example.com');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter sans TLD', () => {
            const result = validateEmail('user@example');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter avec espaces', () => {
            const result = validateEmail('user @example.com');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter avec plusieurs @', () => {
            const result = validateEmail('user@@example.com');
            expect(result.valid).toBe(false);
        });

        it('doit rejeter les caractères invalides', () => {
            const result = validateEmail('user<script>@example.com');
            expect(result.valid).toBe(false);
        });
    });

    describe('Entrées invalides', () => {
        it('doit lever une erreur sans argument', () => {
            expect(() => validateEmail()).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si null', () => {
            expect(() => validateEmail(null)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si undefined', () => {
            expect(() => validateEmail(undefined)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si chaine vide', () => {
            expect(() => validateEmail('')).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si nombre', () => {
            expect(() => validateEmail(12345)).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si objet', () => {
            expect(() => validateEmail({})).toThrow('INVALID_INPUT');
        });

        it('doit lever une erreur si tableau', () => {
            expect(() => validateEmail([])).toThrow('INVALID_INPUT');
        });
    });
});

// tests pour la fonction validateUser qui combine tout
describe('validateUser', () => {

    it('retourne true quand toutes les infos sont bonnes', () => {
        const res = validateUser({
            birthDate: new Date('1998-03-22'),
            postalCode: '75015',
            firstName: 'Kany',
            lastName: 'Chheng',
            email: 'kany.chheng@gmail.com'
        });
        expect(res).toBe(true);
    });

    it('retourne true pour quelquun de 18 ans pile', () => {
        const today = new Date();
        const res = validateUser({
            birthDate: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
            postalCode: '69001',
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie@test.fr'
        });
        expect(res).toBe(true);
    });

    it('retourne true avec nom composé', () => {
        const res = validateUser({
            birthDate: new Date('1985-12-01'),
            postalCode: '97400',
            firstName: 'Jean-Pierre',
            lastName: "O'Brien",
            email: 'jp.obrien@mail.co.uk'
        });
        expect(res).toBe(true);
    });

    // test si l'age bloque bien
    it('retourne false si mineur', () => {
        const today = new Date();
        const res = validateUser({
            birthDate: new Date(today.getFullYear() - 10, 0, 1),
            postalCode: '75001',
            firstName: 'Lucas',
            lastName: 'Petit',
            email: 'lucas@example.com'
        });
        expect(res).toBe(false);
    });

    it('retourne false avec date future', () => {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);
        const res = validateUser({
            birthDate: future,
            postalCode: '75001',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@example.com'
        });
        expect(res).toBe(false);
    });

    it('retourne false avec une date invalide', () => {
        const res = validateUser({
            birthDate: new Date('nimportequoi'),
            postalCode: '75001',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@test.com'
        });
        expect(res).toBe(false);
    });

    // test code postal
    it('retourne false si code postal trop court', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '7500',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@example.com'
        });
        expect(res).toBe(false);
    });

    it('retourne false si code postal avec lettres', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '7500A',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@example.com'
        });
        expect(res).toBe(false);
    });

    // test identité
    it('retourne false si prenom avec chiffres', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '75001',
            firstName: 'Jean123',
            lastName: 'Dupont',
            email: 'jean@example.com'
        });
        expect(res).toBe(false);
    });

    it('retourne false si xss dans le nom', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '75001',
            firstName: 'Jean',
            lastName: '<script>alert("xss")</script>',
            email: 'jean@example.com'
        });
        expect(res).toBe(false);
    });

    // test email
    it('retourne false si email sans @', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '75001',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jeanexample.com'
        });
        expect(res).toBe(false);
    });

    it('retourne false si email incomplet', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '75001',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@'
        });
        expect(res).toBe(false);
    });

    // test quand tout est faux en meme temps
    it('retourne false si tout est invalide', () => {
        const res = validateUser({
            birthDate: new Date('blabla'),
            postalCode: 'ABC',
            firstName: '123',
            lastName: '<script>',
            email: 'pasunmail'
        });
        expect(res).toBe(false);
    });

    // test des cas limites
    it('retourne false si objet vide', () => {
        expect(validateUser({})).toBe(false);
    });

    it('retourne false si null', () => {
        expect(validateUser(null)).toBe(false);
    });

    it('retourne false si undefined', () => {
        expect(validateUser(undefined)).toBe(false);
    });

    it('retourne false si pas d argument', () => {
        expect(validateUser()).toBe(false);
    });

    it('retourne false si il manque le mail', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            postalCode: '75001',
            firstName: 'Jean',
            lastName: 'Dupont'
        });
        expect(res).toBe(false);
    });

    it('retourne false si il manque le code postal', () => {
        const res = validateUser({
            birthDate: new Date('1995-06-10'),
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@example.com'
        });
        expect(res).toBe(false);
    });
});
