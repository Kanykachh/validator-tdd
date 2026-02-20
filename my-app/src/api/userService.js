import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com';

export async function fetchUsers() {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
}

export async function createUser(user) {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
}
