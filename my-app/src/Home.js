import { Link } from 'react-router-dom';
import { useUsers } from './UserContext';

function Home() {
  const { users, loading, error } = useUsers();

  return (
    <div className="App">
      <h1>Accueil</h1>

      {error && (
        <div className="error" role="alert" data-cy="error-server">
          {error}
        </div>
      )}

      {loading && <p data-cy="loading">Chargement...</p>}

      {!loading && !error && (
        <>
          <p data-cy="user-count">
            {users.length === 0
              ? '0 utilisateur inscrit'
              : `${users.length} utilisateur(s) inscrit(s)`}
          </p>

          {users.length > 0 && (
            <table data-cy="user-list">
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} data-cy={`user-row-${index}`}>
                    <td data-cy={`user-firstName-${index}`}>{user.firstName}</td>
                    <td data-cy={`user-lastName-${index}`}>{user.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <Link to="/register" data-cy="link-register">
        <button>S'inscrire</button>
      </Link>
    </div>
  );
}

export default Home;
