import CustomNotFoundError from '../../utils/errors/NotFoundError.js';

import * as conversationRepo from './conversation.repository.js';

export async function getOrCreateDirectConversation({ user1_id, user2_id }, client?) {
  const conversation_id = await conversationRepo.createDirectConversation(
    { user1_id, user2_id },
    client
  );

  return conversation_id;
}

export async function createGroupConversation({ group_id }, client?) {
  const conversation_id = await conversationRepo.createGroupConversation({ group_id }, client);

  if (!conversation_id) {
    throw new Error('Group conversation not created');
  }

  return conversation_id;
}

export async function getDirectConversation({ user1_id, user2_id }, client?) {
  const directConversation = await conversationRepo.getDirectConversation(
    { user1_id, user2_id },
    client
  );

  return directConversation;
}

export async function getGroupConversation({ group_id }, client?) {
  const groupConversation = await conversationRepo.getGroupConversation({ group_id }, client);

  if (!groupConversation) {
    throw new CustomNotFoundError('Group conversation not found');
  }

  return groupConversation;
}

export async function getUserConversationsWithLatestMessage({ user_id }) {
  return conversationRepo.getUserConversationsWithLatestMessage({ user_id });
}

export async function insertGroupConversationMember({ conversation_id, user_id }, client?) {
  const isMemberInserted = await conversationRepo.insertGroupConversationMember(
    {
      conversation_id,
      user_id,
    },
    client
  );

  if (!isMemberInserted) {
    throw new Error('Group conversation member not inserted');
  }
}

export async function removeConversationMember({ conversation_id, user_id }, client?) {
  const isMemberRemoved = await conversationRepo.removeConversationMember(
    {
      conversation_id,
      user_id,
    },
    client
  );

  if (!isMemberRemoved) {
    throw new Error('Group conversation member not removed');
  }
}
