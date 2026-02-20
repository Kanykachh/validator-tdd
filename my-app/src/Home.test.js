import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Home from './Home';

import { fetchUsers } from './api/userService';

jest.mock('./api/userService', () => ({
  fetchUsers: jest.fn(),
  createUser: jest.fn().mockResolvedValue({ id: 11 })
}));

function renderHome() {
  return render(
    <MemoryRouter>
      <UserProvider>
        <Home />
      </UserProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('affiche "0 utilisateur inscrit" quand l API renvoie une liste vide', async () => {
  fetchUsers.mockResolvedValueOnce([]);
  renderHome();

  await waitFor(() => {
    expect(screen.getByText('0 utilisateur inscrit')).toBeInTheDocument();
  });
});

test('affiche le nombre et la liste des utilisateurs', async () => {
  fetchUsers.mockResolvedValueOnce([
    { id: 1, firstName: 'Kany', lastName: 'Chheng' },
    { id: 2, firstName: 'Jean', lastName: 'Dupont' }
  ]);
  renderHome();

  await waitFor(() => {
    expect(screen.getByText('2 utilisateur(s) inscrit(s)')).toBeInTheDocument();
  });
  expect(screen.getByText('Kany')).toBeInTheDocument();
  expect(screen.getByText('Chheng')).toBeInTheDocument();
  expect(screen.getByText('Jean')).toBeInTheDocument();
  expect(screen.getByText('Dupont')).toBeInTheDocument();
});

test('n affiche pas de liste quand il n y a aucun inscrit', async () => {
  fetchUsers.mockResolvedValueOnce([]);
  renderHome();

  await waitFor(() => {
    expect(screen.getByText('0 utilisateur inscrit')).toBeInTheDocument();
  });
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('affiche le lien vers le formulaire d inscription', async () => {
  fetchUsers.mockResolvedValueOnce([]);
  renderHome();

  await waitFor(() => {
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });
});

test('affiche une erreur quand le serveur renvoie une 500', async () => {
  const error500 = new Error('Internal Server Error');
  error500.response = { status: 500, data: {} };
  fetchUsers.mockRejectedValueOnce(error500);

  renderHome();

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le serveur est indisponible, réessayez plus tard'
    );
  });

  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('affiche une erreur quand le reseau est down', async () => {
  fetchUsers.mockRejectedValueOnce(new Error('Network Error'));

  renderHome();

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Impossible de charger les utilisateurs'
    );
  });
});

test('affiche le chargement avant la reponse API', async () => {
  let resolvePromise;
  fetchUsers.mockImplementation(() => new Promise((resolve) => {
    resolvePromise = resolve;
  }));

  renderHome();

  expect(screen.getByText('Chargement...')).toBeInTheDocument();

  resolvePromise([]);

  await waitFor(() => {
    expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
  });
});
