import { api } from '../../api/axios';

export const getCurrentUserProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

export const getUserProfile = async (id: number) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateUserProfile = async (payload: {
  display_name?: string;
  pronouns?: string;
  bio?: string;
  avatar_url?: string | File;
}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined) formData.append(key, val as string | Blob);
  });

  await api.patch('/users/me/profile', formData);
};

export const updateUsername = async (payload: { username: string }) => {
  await api.patch('/users/me/username', payload);
};

export const updateUserAvatar = async (payload: { avatar_url: string | File }) => {
  const formData = new FormData();
  formData.append('avatar_url', payload.avatar_url);
  await api.patch('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
