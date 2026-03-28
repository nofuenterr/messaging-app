import { api } from '../../api/axios';

export const getUserReports = async () => {
  const { data } = await api.get('/reports/me');
  return data;
};

export const getReport = async (id: number) => {
  const { data } = await api.get(`/reports/me/${id}`);
  return data;
};

export const createReport = async (payload: {
  target_user_id?: number;
  target_message_id?: number;
  target_group_id?: number;
  reason: string;
}) => {
  const { data } = await api.post('/reports/me', payload);
  return data;
};
