import { api } from '../../api/axios';

export const upsertNote = async (id: number, payload: { content: string }) => {
  const { data } = await api.put(`/users/${id}/note`, payload);
  return data;
};
