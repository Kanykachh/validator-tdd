import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// on vide le localStorage avant chaque test
beforeEach(() => {
  localStorage.clear();
});

// fonction pour remplir le formulaire avec des bonnes donnees
// ca evite de copier coller partout
function remplirFormulaire() {
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Kany', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Chheng', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'kany@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75015', name: 'postalCode' } });
}

test('affiche le formulaire avec tous les champs', () => {
  render(<App />);

  expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
  expect(screen.getByLabelText('Nom')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
  expect(screen.getByLabelText('Ville')).toBeInTheDocument();
  expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument();
});

test('le bouton est disabled quand le formulaire est vide', () => {
  render(<App />);

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).toBeDisabled();
});

test('le bouton devient actif quand tout est rempli correctement', () => {
  render(<App />);

  remplirFormulaire();

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).not.toBeDisabled();
});

test('le bouton reste disabled si un champ est invalide', () => {
  render(<App />);

  remplirFormulaire();
  // on met un code postal invalide
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '123', name: 'postalCode' } });

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).toBeDisabled();
});

// test du feedback immediat au blur
test('affiche une erreur au blur si le champ est vide', () => {
  render(<App />);

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.focus(prenomInput);
  fireEvent.blur(prenomInput);

  expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
});

test('affiche une erreur au blur si email invalide', () => {
  render(<App />);

  const emailInput = screen.getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'pasunmail', name: 'email' } });
  fireEvent.blur(emailInput);

  expect(screen.getByText("L'email n'est pas valide")).toBeInTheDocument();
});

test('affiche erreur au blur si mineur', () => {
  render(<App />);

  const dateInput = screen.getByLabelText('Date de naissance');
  fireEvent.change(dateInput, { target: { value: '2015-01-01', name: 'birthDate' } });
  fireEvent.blur(dateInput);

  expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
});

test('affiche erreur au blur si code postal invalide', () => {
  render(<App />);

  const cpInput = screen.getByLabelText('Code postal');
  fireEvent.change(cpInput, { target: { value: '123', name: 'postalCode' } });
  fireEvent.blur(cpInput);

  expect(screen.getByText('Le code postal doit contenir 5 chiffres')).toBeInTheDocument();
});

test('affiche erreur au blur si ville invalide', () => {
  render(<App />);

  const villeInput = screen.getByLabelText('Ville');
  fireEvent.change(villeInput, { target: { value: '123', name: 'city' } });
  fireEvent.blur(villeInput);

  expect(screen.getByText('Nom de ville invalide')).toBeInTheDocument();
});

// les erreurs sont en rouge
test('les erreurs sont affichees avec la classe error (rouge)', () => {
  render(<App />);

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.focus(prenomInput);
  fireEvent.blur(prenomInput);

  const errorDiv = screen.getByText('Ce champ est requis');
  expect(errorDiv).toHaveClass('error');
});

// test du formulaire vide soumis (bouton disabled donc on force)
test('affiche les erreurs si on essaye de soumettre avec des champs invalides', () => {
  render(<App />);

  // on remplit avec des trucs invalides
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2015-01-01', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  // le bouton est disabled car mineur, mais on teste le submit quand meme
  // en soumettant le form directement
  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
  expect(screen.queryByText('Inscription enregistrée !')).not.toBeInTheDocument();
});

// inscription qui marche
test('inscription reussie: toaster + localStorage + champs vides', () => {
  render(<App />);

  remplirFormulaire();

  fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

  // toaster de succes
  const toaster = screen.getByRole('alert');
  expect(toaster).toHaveTextContent('Inscription enregistrée !');
  expect(toaster).toHaveClass('success');

  // localStorage rempli
  const saved = JSON.parse(localStorage.getItem('userData'));
  expect(saved.firstName).toBe('Kany');
  expect(saved.lastName).toBe('Chheng');
  expect(saved.email).toBe('kany@test.com');
  expect(saved.postalCode).toBe('75015');
  expect(saved.city).toBe('Paris');

  // les champs sont vides apres la soumission
  expect(screen.getByLabelText('Prénom').value).toBe('');
  expect(screen.getByLabelText('Nom').value).toBe('');
  expect(screen.getByLabelText('Email').value).toBe('');
});

// simulation d'un utilisateur chaotique
test('utilisateur chaotique: saisies invalides, corrections, re-saisies', () => {
  render(<App />);

  // l'user tape n'importe quoi dans le prenom
  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.change(prenomInput, { target: { value: '123', name: 'firstName' } });
  fireEvent.blur(prenomInput);
  expect(screen.getByText('Le nom ne doit contenir que des lettres')).toBeInTheDocument();

  // il corrige
  fireEvent.change(prenomInput, { target: { value: 'Jean', name: 'firstName' } });
  expect(screen.queryByText('Le nom ne doit contenir que des lettres')).not.toBeInTheDocument();

  // il tape un mauvais email
  const emailInput = screen.getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'pasbien', name: 'email' } });
  fireEvent.blur(emailInput);
  expect(screen.getByText("L'email n'est pas valide")).toBeInTheDocument();

  // il corrige l'email
  fireEvent.change(emailInput, { target: { value: 'jean@test.com', name: 'email' } });
  expect(screen.queryByText("L'email n'est pas valide")).not.toBeInTheDocument();

  // il remplit le reste correctement
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-05-10', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Lyon', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '69001', name: 'postalCode' } });

  // maintenant le bouton devrait marcher
  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).not.toBeDisabled();

  fireEvent.click(button);
  expect(screen.getByText('Inscription enregistrée !')).toBeInTheDocument();

  // on verifie le localStorage
  const saved = JSON.parse(localStorage.getItem('userData'));
  expect(saved.firstName).toBe('Jean');
  expect(saved.city).toBe('Lyon');
});

test('le toaster disparait si on modifie un champ apres', () => {
  render(<App />);

  remplirFormulaire();

  fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));
  expect(screen.getByText('Inscription enregistrée !')).toBeInTheDocument();

  // on modifie un champ apres
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Marie', name: 'firstName' } });

  expect(screen.queryByText('Inscription enregistrée !')).not.toBeInTheDocument();
});

// test blur avec une valeur correcte (pas d'erreur affichée)
test('pas d erreur au blur si le champ est valide', () => {
  render(<App />);

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.change(prenomInput, { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.blur(prenomInput);

  expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
  expect(screen.queryByText('Le nom ne doit contenir que des lettres')).not.toBeInTheDocument();
});

test('pas d erreur au blur si nom valide', () => {
  render(<App />);

  const nomInput = screen.getByLabelText('Nom');
  fireEvent.change(nomInput, { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.blur(nomInput);

  expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
});

// test soumission avec email invalide pour couvrir cette branche
test('erreur a la soumission si email invalide', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'pasbien', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  // le bouton est disabled car email invalide, on force le submit
  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText("L'email n'est pas valide")).toBeInTheDocument();
});

// test soumission avec nom invalide
test('erreur a la soumission si nom contient des chiffres', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: '123', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Le nom ne doit contenir que des lettres')).toBeInTheDocument();
});

// test soumission avec ville invalide
test('erreur a la soumission si ville invalide', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: '123', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Nom de ville invalide')).toBeInTheDocument();
});

// test soumission avec code postal invalide
test('erreur a la soumission si code postal invalide', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: 'ABC', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Le code postal doit contenir 5 chiffres')).toBeInTheDocument();
});

// test soumission avec prenom invalide
test('erreur a la soumission si prenom invalide', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: '123', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Le nom ne doit contenir que des lettres')).toBeInTheDocument();
});

test('l erreur disparait quand on corrige le champ', () => {
  render(<App />);

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.focus(prenomInput);
  fireEvent.blur(prenomInput);
  expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();

  // on tape quelque chose
  fireEvent.change(prenomInput, { target: { value: 'Jean', name: 'firstName' } });
  expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
});
