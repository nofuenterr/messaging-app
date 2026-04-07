import type { GetUserConversationsParams } from '../../types/conversation.types.js';
import type { ConversationWithLatestMessageRow } from '../../types/message.types.js';
import * as conversationService from '../conversation/conversation.service.js';

export async function getUserConversationsWithLatestMessage({
  user_id,
}: GetUserConversationsParams): Promise<ConversationWithLatestMessageRow[]> {
  return conversationService.getUserConversationsWithLatestMessage({ user_id });
}
