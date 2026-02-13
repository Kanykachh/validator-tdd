# My-App - Formulaire d'inscription React

## Description

Application React qui permet a un utilisateur de s'inscrire via un formulaire.
Les champs du formulaire sont : nom, prenom, email, date de naissance, ville et code postal.

Les données sont validées avant d'etre sauvegardées dans le localStorage du navigateur.

## Regles de validation

- **Age** : l'utilisateur doit avoir au moins 18 ans
- **Code postal** : doit etre un code postal français (5 chiffres)
- **Nom / Prenom** : pas de chiffres ni de caracteres speciaux, protection contre le XSS
- **Email** : doit etre un email valide (format standard)

Les fonctions de validation sont dans un fichier `src/validator.js` séparé.

## Lancer le projet

```bash
cd my-app
npm install
npm start
```

L'app se lance sur http://localhost:3000

## Lancer les tests

```bash
npm test
```

Les tests incluent :
- Tests unitaires des fonctions de validation (validator.test.js)
- Tests d'integration du composant React (App.test.js)

## Coverage

```bash
npm test -- --coverage
```

Le coverage attendu est de 100% sur les fichiers testés (index.js et reportWebVitals.js sont exclus).

## Technologies

- React 19
- React Testing Library
- Jest
