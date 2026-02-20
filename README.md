# Validator TDD - Activité M1

Projet de validation développé en TDD (Test Driven Development).

## Installation

```bash
npm install
```

## Tests unitaires (validator)

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

### API

L'application utilise **JSONPlaceholder** comme fake API REST via **Axios**.

Les appels sont isolés dans `src/api/userService.js` :
- `fetchUsers()` : GET `/users` — récupère la liste des inscrits
- `createUser(user)` : POST `/users` — crée un nouvel inscrit

### Gestion des erreurs

- **400** (email déjà utilisé) : le message d'erreur renvoyé par le back est affiché sous le formulaire
- **500** (serveur down) : une alerte informe l'utilisateur que le serveur est indisponible
- **Erreur réseau** : message générique affiché

### Tests d'intégration (Jest)

Les tests sont dans `src/api/userService.test.js`, `src/App.test.js` et `src/Home.test.js`.

On utilise `jest.mock('axios')` pour simuler les réponses API sans aucun appel réseau réel.

Cas testés :
- Succès (200/201) : inscription réussie, liste affichée
- Erreur métier (400) : email déjà existant → message spécifique affiché
- Crash serveur (500) : serveur down → alerte utilisateur, UI stable

Vérifications : `toHaveBeenCalledWith` pour l'URL et le payload, `waitFor` pour l'asynchronicité.

```bash
cd my-app
npm test
```

### Tests E2E (Cypress)

Les tests Cypress utilisent `cy.intercept()` pour intercepter les appels vers JSONPlaceholder.
Aucun backend réel n'est nécessaire pour les faire tourner.

Scénarios couverts :
- Parcours nominal (inscription + retour accueil)
- Erreur 400 (email déjà utilisé)
- Erreur 500 (serveur indisponible)
- Validation côté client (champs invalides)

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

### Pipeline CI/CD

La pipeline GitHub Actions (`.github/workflows/ci.yml`) :
1. Lance les tests unitaires du validator
2. Lance les tests d'intégration React (Jest avec mocks axios)
3. Lance les tests E2E Cypress
4. Génère la doc JSDoc et déploie sur GitHub Pages
