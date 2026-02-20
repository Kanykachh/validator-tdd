import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchUsers, createUser } from './api/userService';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = async (user) => {
    try {
      const created = await createUser(user);
      setUsers((prev) => [...prev, { ...user, id: created.id }]);
      return { success: true };
    } catch (err) {
      setError('Erreur lors de l\'inscription');
      return { success: false, error: 'Erreur réseau, réessayez plus tard' };
    }
  };

  return (
    <UserContext.Provider value={{ users, addUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  return useContext(UserContext);
}
