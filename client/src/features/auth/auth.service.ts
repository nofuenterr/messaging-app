import { api } from '../../api/axios';

export const login = async (payload: { username: string; password: string }) => {
  const { data } = await api.post('/auth/login', payload);

  return data.user;
};

export const signup = async (payload: {
  username: string;
  password: string;
  avatar_color: string;
}) => {
  const { data } = await api.post('/auth/signup', payload);
  return data;
};

export const logout = async () => {
  const { data } = await api.get('/auth/logout');

  return data;
};
