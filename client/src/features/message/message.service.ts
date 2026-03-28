import { api } from '../../api/axios';

// DMs
export const getDMMessages = async (id: number, lastMessageId?: number) => {
  const { data } = await api.get(`/users/${id}/messages`, {
    params: { last_message_id: lastMessageId },
  });
  return data;
};

export const createDMMessage = async (
  id: number,
  payload: {
    content: string;
    reply_to_message_id?: number;
    message_type?: 'text' | 'system';
    system_event_type?: 'user_pin';
  }
) => {
  const { data } = await api.post(`/users/${id}/messages`, payload);
  return data;
};

export const updateDMMessage = async (payload: {
  userId: number;
  messageId: number;
  content: string;
}) => {
  await api.patch(`/users/${payload.userId}/messages/${payload.messageId}`, {
    content: payload.content,
  });
};

export const deleteDMMessage = async (payload: { userId: number; messageId: number }) => {
  await api.delete(`/users/${payload.userId}/messages/${payload.messageId}`);
};

// Group Messages
export const getGroupMessages = async (groupId: number, lastMessageId?: number) => {
  const { data } = await api.get(`/groups/${groupId}/messages`, {
    params: { last_message_id: lastMessageId },
  });
  return data;
};

export const createGroupMessage = async (
  groupId: number,
  payload: {
    content: string;
    reply_to_message_id?: number;
    message_type?: 'text' | 'system';
    system_event_type?:
      | 'user_join'
      | 'user_leave'
      | 'user_kick'
      | 'group_rename'
      | 'group_create'
      | 'user_pin';
  }
) => {
  const { data } = await api.post(`/groups/${groupId}/messages`, payload);
  return data;
};

export const updateGroupMessage = async (payload: {
  groupId: number;
  messageId: number;
  content: string;
}) => {
  await api.patch(`/groups/${payload.groupId}/messages/${payload.messageId}`, {
    content: payload.content,
  });
};

export const deleteGroupMessage = async (payload: { groupId: number; messageId: number }) => {
  await api.delete(`/groups/${payload.groupId}/messages/${payload.messageId}`);
};
