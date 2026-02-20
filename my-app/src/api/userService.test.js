import axios from 'axios';
import { fetchUsers, createUser } from './userService';

jest.mock('axios');

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchUsers', () => {
  it('recupere la liste des utilisateurs', async () => {
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

  it('renvoie une erreur en cas de probleme reseau', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchUsers()).rejects.toThrow('Network Error');
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
  });
});

describe('createUser', () => {
  it('cree un utilisateur et renvoie la reponse', async () => {
    const newUser = {
      firstName: 'Kany',
      lastName: 'Chheng',
      email: 'kany@test.com'
    };

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

  it('renvoie une erreur si le serveur est down', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(createUser({ firstName: 'Test' })).rejects.toThrow('Network Error');
    expect(axios.post).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      { firstName: 'Test' }
    );
  });
});
