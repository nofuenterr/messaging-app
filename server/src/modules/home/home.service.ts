import * as conversationService from '../conversation/conversation.service.js';

export async function getUserConversationsWithLatestMessage({ user_id }) {
  return conversationService.getUserConversationsWithLatestMessage({ user_id });
}
