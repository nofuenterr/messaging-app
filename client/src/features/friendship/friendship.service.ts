import { api } from '../../api/axios';

export const getFriendship = async () => {
  const { data } = await api.get('/users/me/friends');
  return data;
};

export const sendFriendRequest = async (id: number) => {
  await api.post(`/users/${id}/friend-request`);
};

export const acceptFriendRequest = async (id: number) => {
  await api.patch(`/users/${id}/friend-request/accept`);
};

export const declineFriendRequest = async (id: number) => {
  await api.patch(`/users/${id}/friend-request/decline`);
};

export const unfriendUser = async (id: number) => {
  await api.delete(`/users/${id}/friend`);
};
