import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Home from './Home';

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
  localStorage.clear();
});

test('affiche "0 utilisateur inscrit" quand personne n est inscrit', () => {
  renderHome();
  expect(screen.getByText('0 utilisateur inscrit')).toBeInTheDocument();
});

test('affiche le nombre et la liste des utilisateurs inscrits', () => {
  localStorage.setItem('users', JSON.stringify([
    { firstName: 'Kany', lastName: 'Chheng' },
    { firstName: 'Jean', lastName: 'Dupont' }
  ]));
  renderHome();
  expect(screen.getByText('2 utilisateur(s) inscrit(s)')).toBeInTheDocument();
  expect(screen.getByText('Kany')).toBeInTheDocument();
  expect(screen.getByText('Chheng')).toBeInTheDocument();
  expect(screen.getByText('Jean')).toBeInTheDocument();
  expect(screen.getByText('Dupont')).toBeInTheDocument();
});

test('n affiche pas de liste quand il n y a aucun inscrit', () => {
  renderHome();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('affiche le lien vers le formulaire d inscription', () => {
  renderHome();
  expect(screen.getByText("S'inscrire")).toBeInTheDocument();
});
