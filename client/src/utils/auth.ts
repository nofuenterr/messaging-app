import { api } from '../api/axios';

export async function checkAuth() {
  try {
    await api.get('/users/me');
    return true;
  } catch {
    return false;
  }
}
