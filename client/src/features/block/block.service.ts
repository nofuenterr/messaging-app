import { api } from '../../api/axios';

export const getBlockList = async () => {
  const { data } = await api.get('/users/me/blocks');
  return data;
};

export const blockUser = async (id: number) => {
  await api.post(`/users/${id}/block`);
};

export const unblockUser = async (id: number) => {
  await api.delete(`/users/${id}/block`);
};
