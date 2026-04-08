import { api } from '../../api/axios';

export const getGroups = async () => {
  const { data } = await api.get('/groups');
  return data;
};

export const getUserGroups = async () => {
  const { data } = await api.get('/groups/me');
  return data;
};

export const getGroup = async (id: number) => {
  const { data } = await api.get(`/groups/${id}`);
  return data;
};

export const createGroup = async (payload: {
  group_name: string;
  group_description?: string;
  avatar_url: File | string;
  banner_url?: File | string;
  avatar_color: string;
}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined) formData.append(key, val as string | Blob);
  });

  const { data } = await api.post('/groups', formData);

  return data;
};

export const updateGroup = async (
  id: number,
  payload: {
    group_name?: string;
    group_description?: string;
    avatar_url?: string | File;
    banner_url?: string | File;
  }
) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined) formData.append(key, val as string | Blob);
  });

  await api.patch(`/groups/${id}`, formData);
};

export const updateGroupProfile = async (
  id: number,
  payload: {
    group_display_name?: string;
    group_pronouns?: string;
  }
) => {
  await api.patch(`/groups/${id}/me/profile`, payload);
};

export const deleteGroup = async (id: number) => {
  await api.delete(`/groups/${id}`);
};

export const joinGroup = async (id: number) => {
  const { data } = await api.post(`/groups/${id}/join`);
  return data;
};

export const leaveGroup = async (id: number) => {
  await api.delete(`/groups/${id}/leave`);
};

export const kickUser = async (id: number, userId: number) => {
  await api.delete(`/groups/${id}/kick/${userId}`);
};

export const setGroupMemberAsAdmin = async (id: number, userId: number) => {
  await api.patch(`/groups/${id}/set-admin/${userId}`);
};

export const setGroupAdminAsMember = async (id: number, userId: number) => {
  await api.patch(`/groups/${id}/set-member/${userId}`);
};

export const getUserGroupProfile = async (id: number, userId: number) => {
  const { data } = await api.get(`/groups/${id}/${userId}/profile`);
  return data;
};
