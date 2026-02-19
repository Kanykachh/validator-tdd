# Validator TDD - Activité M1

Projet de validation développé en TDD (Test Driven Development).

## Installation

```bash
npm install
```

## Tests

```bash
npm test
```

## Documentation

Générer la documentation avec jsdoc :

```bash
npm run jsdoc
```

## Application React

L'application React se trouve dans le dossier `my-app/`.

```bash
cd my-app
npm install
npm start
```

### Pages

- `/` : Page d'accueil avec compteur et liste des utilisateurs inscrits
- `/register` : Formulaire d'inscription

### Tests E2E (Cypress)

Lancer l'application puis Cypress :

```bash
cd my-app
npm start
```

Dans un autre terminal :

```bash
cd my-app
npm run cypress
```

Ou en mode headless :

```bash
cd my-app
npm run cypress:run
```
