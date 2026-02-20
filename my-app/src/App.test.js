import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import App from './App';
import { fetchUsers, createUser } from './api/userService';

jest.mock('./api/userService');

function renderApp() {
  return render(
    <MemoryRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  fetchUsers.mockResolvedValue([]);
  createUser.mockResolvedValue({ id: 11 });
});

function remplirFormulaire() {
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Kany', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Chheng', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'kany@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75015', name: 'postalCode' } });
}

test('affiche le formulaire avec tous les champs', () => {
  renderApp();

  expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
  expect(screen.getByLabelText('Nom')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
  expect(screen.getByLabelText('Ville')).toBeInTheDocument();
  expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument();
});

test('le bouton est disabled quand le formulaire est vide', () => {
  renderApp();

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).toBeDisabled();
});

test('le bouton devient actif quand tout est rempli correctement', () => {
  renderApp();
  remplirFormulaire();

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).not.toBeDisabled();
});

test('le bouton reste disabled si un champ est invalide', () => {
  renderApp();
  remplirFormulaire();
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '123', name: 'postalCode' } });

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).toBeDisabled();
});

test('affiche une erreur au blur si le champ est vide', () => {
  renderApp();

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.focus(prenomInput);
  fireEvent.blur(prenomInput);

  expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
});

test('affiche une erreur au blur si email invalide', () => {
  renderApp();

  const emailInput = screen.getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'pasunmail', name: 'email' } });
  fireEvent.blur(emailInput);

  expect(screen.getByText("L'email n'est pas valide")).toBeInTheDocument();
});

test('affiche erreur au blur si mineur', () => {
  renderApp();

  const dateInput = screen.getByLabelText('Date de naissance');
  fireEvent.change(dateInput, { target: { value: '2015-01-01', name: 'birthDate' } });
  fireEvent.blur(dateInput);

  expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
});

test('affiche erreur au blur si code postal invalide', () => {
  renderApp();

  const cpInput = screen.getByLabelText('Code postal');
  fireEvent.change(cpInput, { target: { value: '123', name: 'postalCode' } });
  fireEvent.blur(cpInput);

  expect(screen.getByText('Le code postal doit contenir 5 chiffres')).toBeInTheDocument();
});

test('affiche erreur au blur si ville invalide', () => {
  renderApp();

  const villeInput = screen.getByLabelText('Ville');
  fireEvent.change(villeInput, { target: { value: '123', name: 'city' } });
  fireEvent.blur(villeInput);

  expect(screen.getByText('Nom de ville invalide')).toBeInTheDocument();
});

test('les erreurs sont affichees avec la classe error (rouge)', () => {
  renderApp();

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.focus(prenomInput);
  fireEvent.blur(prenomInput);

  const errorDiv = screen.getByText('Ce champ est requis');
  expect(errorDiv).toHaveClass('error');
});

test('affiche les erreurs si on essaye de soumettre avec des champs invalides', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2015-01-01', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
  expect(screen.queryByText('Inscription enregistrée !')).not.toBeInTheDocument();
});

test('inscription reussie: toaster + champs vides', async () => {
  renderApp();
  remplirFormulaire();

  fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

  await waitFor(() => {
    const toaster = screen.getByRole('alert');
    expect(toaster).toHaveTextContent('Inscription enregistrée !');
    expect(toaster).toHaveClass('success');
  });

  expect(screen.getByLabelText('Prénom').value).toBe('');
  expect(screen.getByLabelText('Nom').value).toBe('');
  expect(screen.getByLabelText('Email').value).toBe('');
});

test('utilisateur chaotique: saisies invalides, corrections, re-saisies', async () => {
  renderApp();

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.change(prenomInput, { target: { value: '123', name: 'firstName' } });
  fireEvent.blur(prenomInput);
  expect(screen.getByText('Le nom ne doit contenir que des lettres')).toBeInTheDocument();

  fireEvent.change(prenomInput, { target: { value: 'Jean', name: 'firstName' } });
  expect(screen.queryByText('Le nom ne doit contenir que des lettres')).not.toBeInTheDocument();

  const emailInput = screen.getByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'pasbien', name: 'email' } });
  fireEvent.blur(emailInput);
  expect(screen.getByText("L'email n'est pas valide")).toBeInTheDocument();

  fireEvent.change(emailInput, { target: { value: 'jean@test.com', name: 'email' } });
  expect(screen.queryByText("L'email n'est pas valide")).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-05-10', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Lyon', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '69001', name: 'postalCode' } });

  const button = screen.getByRole('button', { name: "S'inscrire" });
  expect(button).not.toBeDisabled();

  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText('Inscription enregistrée !')).toBeInTheDocument();
  });
});

test('le toaster disparait si on modifie un champ apres', async () => {
  renderApp();
  remplirFormulaire();

  fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

  await waitFor(() => {
    expect(screen.getByText('Inscription enregistrée !')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Marie', name: 'firstName' } });

  expect(screen.queryByText('Inscription enregistrée !')).not.toBeInTheDocument();
});

test('pas d erreur au blur si le champ est valide', () => {
  renderApp();

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.change(prenomInput, { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.blur(prenomInput);

  expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
  expect(screen.queryByText('Le nom ne doit contenir que des lettres')).not.toBeInTheDocument();
});

test('pas d erreur au blur si nom valide', () => {
  renderApp();

  const nomInput = screen.getByLabelText('Nom');
  fireEvent.change(nomInput, { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.blur(nomInput);

  expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
});

test('erreur a la soumission si email invalide', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'pasbien', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText("L'email n'est pas valide")).toBeInTheDocument();
});

test('erreur a la soumission si nom contient des chiffres', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: '123', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Le nom ne doit contenir que des lettres')).toBeInTheDocument();
});

test('erreur a la soumission si ville invalide', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: '123', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '75001', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Nom de ville invalide')).toBeInTheDocument();
});

test('erreur a la soumission si code postal invalide', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean', name: 'firstName' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont', name: 'lastName' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@test.com', name: 'email' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1998-03-22', name: 'birthDate' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris', name: 'city' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: 'ABC', name: 'postalCode' } });

  fireEvent.submit(screen.getByRole('button', { name: "S'inscrire" }));

  expect(screen.getByText('Le code postal doit contenir 5 chiffres')).toBeInTheDocument();
});

test('erreur a la soumission si prenom invalide', () => {
  renderApp();

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
  renderApp();

  const prenomInput = screen.getByLabelText('Prénom');
  fireEvent.focus(prenomInput);
  fireEvent.blur(prenomInput);
  expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();

  fireEvent.change(prenomInput, { target: { value: 'Jean', name: 'firstName' } });
  expect(screen.queryByText('Ce champ est requis')).not.toBeInTheDocument();
});
