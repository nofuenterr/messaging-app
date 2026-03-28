import { api } from '../../api/axios';

export const getReports = async () => {
  const { data } = await api.get('/admin/reports');
  return data;
};

export const getReport = async (id: number) => {
  const { data } = await api.get(`/admin/reports/${id}`);
  return data;
};

export const reviewReport = async (id: number) => {
  await api.patch(`/admin/reports/${id}/review`);
};

export const resolveReport = async (id: number) => {
  await api.patch(`/admin/reports/${id}/resolve`);
};

export const getUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};
