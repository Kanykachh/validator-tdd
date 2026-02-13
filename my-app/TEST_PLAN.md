# Plan de test - Formulaire d'inscription React

## Stratégie de test

On a deux niveaux de tests :
- **Tests unitaires (UT)** : on teste les fonctions de validation toutes seules, sans React
- **Tests d'intégration (IT)** : on teste le composant React avec le formulaire, le DOM, les interactions utilisateur

## Tests unitaires - validator.test.js

Ces tests verifient que chaque fonction de validation marche correctement toute seule.

### validateAge
| Cas testé | Type | Résultat attendu |
|---|---|---|
| Personne de plus de 18 ans | Valide | valid: true |
| Personne de 18 ans pile | Limite | valid: true |
| Mineur (10 ans) | Invalide | valid: false |
| Date vide | Invalide | valid: false |
| Null | Invalide | valid: false |
| Date pas une vraie date | Invalide | valid: false |

### validatePostalCode
| Cas testé | Type | Résultat attendu |
|---|---|---|
| 75001 (Paris) | Valide | valid: true |
| 97400 (DOM-TOM) | Valide | valid: true |
| Moins de 5 chiffres | Invalide | valid: false |
| Avec des lettres | Invalide | valid: false |
| Vide | Invalide | valid: false |
| Null | Invalide | valid: false |
| Avec espaces | Invalide | valid: false |

### validateName
| Cas testé | Type | Résultat attendu |
|---|---|---|
| Nom simple | Valide | valid: true |
| Avec accents | Valide | valid: true |
| Avec tirets | Valide | valid: true |
| Avec apostrophes | Valide | valid: true |
| Avec chiffres | Invalide | valid: false |
| Vide | Invalide | valid: false |
| Null | Invalide | valid: false |
| Balises script (XSS) | Invalide | valid: false |
| Caracteres encodés XSS | Invalide | valid: false |
| Caracteres speciaux | Invalide | valid: false |

### validateEmail
| Cas testé | Type | Résultat attendu |
|---|---|---|
| Email normal | Valide | valid: true |
| Email avec points | Valide | valid: true |
| Sans @ | Invalide | valid: false |
| Sans domaine | Invalide | valid: false |
| Vide | Invalide | valid: false |
| Null | Invalide | valid: false |

### validateCity
| Cas testé | Type | Résultat attendu |
|---|---|---|
| Paris | Valide | valid: true |
| Ville avec accent | Valide | valid: true |
| Avec chiffres | Invalide | valid: false |
| Vide | Invalide | valid: false |
| Null | Invalide | valid: false |

### validateForm
| Cas testé | Type | Résultat attendu |
|---|---|---|
| Toutes les données bonnes | Valide | true |
| Mineur | Invalide | false |
| Code postal invalide | Invalide | false |
| Prenom invalide | Invalide | false |
| Nom invalide | Invalide | false |
| Email invalide | Invalide | false |
| Ville invalide | Invalide | false |

## Tests d'intégration - App.test.js

Ces tests verifient que le composant React reagit bien aux actions de l'utilisateur.

### Affichage du formulaire
| Cas testé | Vérifié |
|---|---|
| Tous les champs sont presents dans le DOM | Oui |
| Le bouton "S'inscrire" est present | Oui |
| Le bouton est disabled quand le formulaire est vide | Oui |

### Feedback immediat (blur)
| Cas testé | Vérifié |
|---|---|
| Erreur affichée au blur si champ vide | Oui |
| Erreur affichée au blur si email invalide | Oui |
| Erreur affichée au blur si mineur | Oui |
| Erreur affichée au blur si code postal invalide | Oui |
| Erreur affichée au blur si ville invalide | Oui |
| Pas d'erreur au blur si la valeur est bonne | Oui |
| Les erreurs ont la classe CSS "error" (rouge) | Oui |
| L'erreur disparait quand on corrige le champ | Oui |

### Bouton disabled
| Cas testé | Vérifié |
|---|---|
| Disabled quand formulaire vide | Oui |
| Actif quand tout est rempli correctement | Oui |
| Disabled si un champ est invalide | Oui |

### Soumission du formulaire
| Cas testé | Vérifié |
|---|---|
| Erreurs affichées si soumission avec champs invalides | Oui |
| Erreur si email invalide a la soumission | Oui |
| Erreur si nom invalide a la soumission | Oui |
| Erreur si ville invalide a la soumission | Oui |
| Erreur si code postal invalide a la soumission | Oui |
| Erreur si prenom invalide a la soumission | Oui |

### Succès de l'inscription
| Cas testé | Vérifié |
|---|---|
| Toaster de succes affiché avec role="alert" | Oui |
| Données sauvegardées dans le localStorage | Oui |
| Les champs sont vidés apres la soumission | Oui |
| Le toaster disparait si on modifie un champ | Oui |

### Utilisateur chaotique
| Cas testé | Vérifié |
|---|---|
| Saisie invalide -> erreur -> correction -> erreur disparait | Oui |
| Email invalide -> correction -> OK | Oui |
| Remplissage correct apres erreurs -> bouton actif -> soumission OK | Oui |
| Verification du localStorage apres parcours chaotique | Oui |

## Couverture de code

- validator.js : 100% (statements, branches, fonctions, lignes)
- App.js : 100% lignes et fonctions, ~98% branches
- index.js et reportWebVitals.js sont exclus du coverage car ils ne contiennent pas de logique metier
