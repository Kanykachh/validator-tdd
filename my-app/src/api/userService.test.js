import axios from 'axios';
import { fetchUsers, createUser } from './userService';

jest.mock('axios');

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchUsers', () => {
  it('recupere la liste des utilisateurs (200)', async () => {
    const fakeUsers = [
      { id: 1, firstName: 'Kany', lastName: 'Chheng' },
      { id: 2, firstName: 'Jean', lastName: 'Dupont' }
    ];

    axios.get.mockResolvedValueOnce({ data: fakeUsers });

    const result = await fetchUsers();

    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeUsers);
    expect(result).toHaveLength(2);
  });

  it('rejette en cas d erreur serveur 500', async () => {
    const error = new Error('Internal Server Error');
    error.response = { status: 500, data: {} };
    axios.get.mockRejectedValueOnce(error);

    await expect(fetchUsers()).rejects.toThrow('Internal Server Error');
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
  });

  it('rejette en cas d erreur reseau', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchUsers()).rejects.toThrow('Network Error');
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
  });
});

describe('createUser', () => {
  const newUser = {
    firstName: 'Kany',
    lastName: 'Chheng',
    email: 'kany@test.com'
  };

  it('cree un utilisateur avec succes (201)', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 11, ...newUser } });

    const result = await createUser(newUser);

    expect(axios.post).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      newUser
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(11);
    expect(result.firstName).toBe('Kany');
  });

  it('rejette avec 400 si email deja utilise', async () => {
    const error = new Error('Bad Request');
    error.response = {
      status: 400,
      data: { message: 'Cet email est déjà utilisé' }
    };
    axios.post.mockRejectedValueOnce(error);

    await expect(createUser(newUser)).rejects.toThrow('Bad Request');
    expect(axios.post).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      newUser
    );
  });

  it('rejette avec 500 si le serveur est down', async () => {
    const error = new Error('Internal Server Error');
    error.response = { status: 500, data: {} };
    axios.post.mockRejectedValueOnce(error);

    await expect(createUser(newUser)).rejects.toThrow('Internal Server Error');
    expect(axios.post).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      newUser
    );
  });
});
