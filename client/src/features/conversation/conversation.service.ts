import { api } from '../../api/axios';

export const getUserConversationsWithLatestMessage = async () => {
  const { data } = await api.get('/conversations');
  return data;
};
