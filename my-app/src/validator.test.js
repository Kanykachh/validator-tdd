import { validateAge, validatePostalCode, validateName, validateEmail, validateCity, validateForm } from './validator';

// ---- tests validateAge ----

describe('validateAge', () => {
    it('accepte quelquun de plus de 18 ans', () => {
        const res = validateAge('1998-03-22');
        expect(res.valid).toBe(true);
    });

    it('accepte quelquun de 18 ans pile', () => {
        const today = new Date();
        const y = today.getFullYear() - 18;
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const res = validateAge(`${y}-${m}-${d}`);
        expect(res.valid).toBe(true);
    });

    it('refuse un mineur', () => {
        const today = new Date();
        const y = today.getFullYear() - 10;
        const res = validateAge(`${y}-01-01`);
        expect(res.valid).toBe(false);
        expect(res.error).toBeDefined();
    });

    it('refuse si la date est vide', () => {
        expect(validateAge('').valid).toBe(false);
    });

    it('refuse si null', () => {
        expect(validateAge(null).valid).toBe(false);
    });

    it('refuse une date invalide', () => {
        expect(validateAge('nimportequoi').valid).toBe(false);
    });
});

// ---- tests validatePostalCode ----

describe('validatePostalCode', () => {
    it('accepte 75001', () => {
        expect(validatePostalCode('75001').valid).toBe(true);
    });

    it('accepte 97400 (DOM-TOM)', () => {
        expect(validatePostalCode('97400').valid).toBe(true);
    });

    it('refuse moins de 5 chiffres', () => {
        const res = validatePostalCode('7500');
        expect(res.valid).toBe(false);
    });

    it('refuse des lettres', () => {
        expect(validatePostalCode('7500A').valid).toBe(false);
    });

    it('refuse si vide', () => {
        expect(validatePostalCode('').valid).toBe(false);
    });

    it('refuse si null', () => {
        expect(validatePostalCode(null).valid).toBe(false);
    });

    it('refuse avec des espaces', () => {
        expect(validatePostalCode('75 001').valid).toBe(false);
    });
});

// ---- tests validateName ----

describe('validateName', () => {
    it('accepte un nom simple', () => {
        expect(validateName('Jean').valid).toBe(true);
    });

    it('accepte les accents', () => {
        expect(validateName('Hélène').valid).toBe(true);
    });

    it('accepte les tirets', () => {
        expect(validateName('Jean-Pierre').valid).toBe(true);
    });

    it('accepte les apostrophes', () => {
        expect(validateName("O'Brien").valid).toBe(true);
    });

    it('refuse les chiffres', () => {
        expect(validateName('Jean123').valid).toBe(false);
    });

    it('refuse si vide', () => {
        expect(validateName('').valid).toBe(false);
    });

    it('refuse si null', () => {
        expect(validateName(null).valid).toBe(false);
    });

    it('refuse les balises script (XSS)', () => {
        const res = validateName('<script>alert("xss")</script>');
        expect(res.valid).toBe(false);
    });

    it('refuse les caracteres encodés XSS', () => {
        expect(validateName('%3Cscript%3E').valid).toBe(false);
    });

    it('refuse les caracteres speciaux', () => {
        expect(validateName('Jean@!').valid).toBe(false);
    });
});

// ---- tests validateEmail ----

describe('validateEmail', () => {
    it('accepte un email normal', () => {
        expect(validateEmail('jean@gmail.com').valid).toBe(true);
    });

    it('accepte un email avec des points', () => {
        expect(validateEmail('jean.dupont@test.fr').valid).toBe(true);
    });

    it('refuse sans @', () => {
        expect(validateEmail('jeangmail.com').valid).toBe(false);
    });

    it('refuse sans domaine', () => {
        expect(validateEmail('jean@').valid).toBe(false);
    });

    it('refuse si vide', () => {
        expect(validateEmail('').valid).toBe(false);
    });

    it('refuse si null', () => {
        expect(validateEmail(null).valid).toBe(false);
    });
});

// ---- tests validateCity ----

describe('validateCity', () => {
    it('accepte Paris', () => {
        expect(validateCity('Paris').valid).toBe(true);
    });

    it('accepte une ville avec accent', () => {
        expect(validateCity('Saint-Étienne').valid).toBe(true);
    });

    it('refuse les chiffres', () => {
        expect(validateCity('Paris75').valid).toBe(false);
    });

    it('refuse si vide', () => {
        expect(validateCity('').valid).toBe(false);
    });

    it('refuse si null', () => {
        expect(validateCity(null).valid).toBe(false);
    });
});

// ---- tests validateForm ----

describe('validateForm', () => {
    const bonnesDonnees = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@test.com',
        birthDate: '1998-03-22',
        city: 'Paris',
        postalCode: '75001'
    };

    it('retourne true si tout est bon', () => {
        expect(validateForm(bonnesDonnees)).toBe(true);
    });

    it('retourne false si mineur', () => {
        expect(validateForm({ ...bonnesDonnees, birthDate: '2015-01-01' })).toBe(false);
    });

    it('retourne false si code postal invalide', () => {
        expect(validateForm({ ...bonnesDonnees, postalCode: '123' })).toBe(false);
    });

    it('retourne false si prenom invalide', () => {
        expect(validateForm({ ...bonnesDonnees, firstName: '123' })).toBe(false);
    });

    it('retourne false si nom invalide', () => {
        expect(validateForm({ ...bonnesDonnees, lastName: '<script>' })).toBe(false);
    });

    it('retourne false si email invalide', () => {
        expect(validateForm({ ...bonnesDonnees, email: 'pasunmail' })).toBe(false);
    });

    it('retourne false si ville invalide', () => {
        expect(validateForm({ ...bonnesDonnees, city: '123' })).toBe(false);
    });
});
