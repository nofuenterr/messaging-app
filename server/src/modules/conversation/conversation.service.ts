import type { PoolClient } from 'pg';

import type {
  CreateDirectConversationParams,
  CreateGroupConversationParams,
  GetDirectConversationParams,
  GetGroupConversationParams,
  GetUserConversationsParams,
  InsertConversationMemberParams,
  RemoveConversationMemberParams,
} from '../../types/conversation.types.js';
import type {
  DBConversation,
  ConversationWithLatestMessageRow,
} from '../../types/message.types.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';

import * as conversationRepo from './conversation.repository.js';

export async function getOrCreateDirectConversation(
  { user1_id, user2_id }: CreateDirectConversationParams,
  client?: PoolClient
): Promise<number> {
  return conversationRepo.createDirectConversation({ user1_id, user2_id }, client);
}

export async function createGroupConversation(
  { group_id }: CreateGroupConversationParams,
  client?: PoolClient
): Promise<number> {
  const conversation_id = await conversationRepo.createGroupConversation({ group_id }, client);

  if (!conversation_id) {
    throw new Error('Group conversation not created');
  }

  return conversation_id;
}

export async function getDirectConversation(
  { user1_id, user2_id }: GetDirectConversationParams,
  client?: PoolClient
): Promise<DBConversation | undefined> {
  return conversationRepo.getDirectConversation({ user1_id, user2_id }, client);
}

export async function getGroupConversation(
  { group_id }: GetGroupConversationParams,
  client?: PoolClient
): Promise<DBConversation> {
  const groupConversation = await conversationRepo.getGroupConversation({ group_id }, client);

  if (!groupConversation) {
    throw new NotFoundError('Group conversation not found');
  }

  return groupConversation;
}

export async function getUserConversationsWithLatestMessage({
  user_id,
}: GetUserConversationsParams): Promise<ConversationWithLatestMessageRow[]> {
  return conversationRepo.getUserConversationsWithLatestMessage({ user_id });
}

export async function insertGroupConversationMember(
  { conversation_id, user_id }: InsertConversationMemberParams,
  client?: PoolClient
): Promise<void> {
  const isMemberInserted = await conversationRepo.insertGroupConversationMember(
    { conversation_id, user_id },
    client
  );

  if (!isMemberInserted) {
    throw new Error('Group conversation member not inserted');
  }
}

export async function removeConversationMember(
  { conversation_id, user_id }: RemoveConversationMemberParams,
  client?: PoolClient
): Promise<void> {
  const isMemberRemoved = await conversationRepo.removeConversationMember(
    { conversation_id, user_id },
    client
  );

  if (!isMemberRemoved) {
    throw new Error('Group conversation member not removed');
  }
}
