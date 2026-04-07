import type { PoolClient } from 'pg';

import pool from '../../config/database.js';
import type {
  CreateMessageParams,
  CreateDirectMessageParams,
  CreatedMessage,
  MessageRow,
  GetConversationMessagesParams,
  GetGroupMessagesParams,
  GetDirectMessagesParams,
  UpdateMessageParams,
  DeleteMessageParams,
  GroupMessagesResult,
  DirectMessagesResult,
} from '../../types/message.types.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';
import * as conversationService from '../conversation/conversation.service.js';

import * as messageRepo from './message.repository.js';

export async function createMessage(
  params: CreateMessageParams,
  client?: PoolClient
): Promise<CreatedMessage> {
  const message = await messageRepo.createMessage(params, client);

  if (!message) throw new Error('Message could not be created');

  return message;
}

export async function createGroupMessage(
  params: CreateMessageParams,
  client?: PoolClient
): Promise<CreatedMessage> {
  return createMessage(params, client);
}

export async function createDirectMessage({
  author_id,
  other_user_id,
  reply_to_message_id,
  message_type,
  system_event_type,
  content,
}: CreateDirectMessageParams): Promise<CreatedMessage> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    const conversation_id = await conversationService.getOrCreateDirectConversation(
      { user1_id: author_id, user2_id: other_user_id },
      client
    );

    const message = await createMessage(
      {
        author_id,
        conversation_id,
        reply_to_message_id,
        message_type,
        system_event_type,
        content,
      },
      client
    );

    await client.query('COMMIT');
    return message;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getConversationMessages(
  params: GetConversationMessagesParams
): Promise<MessageRow[]> {
  return messageRepo.getConversationMessages(params);
}

export async function getGroupMessages({
  group_id,
  last_message_id,
}: GetGroupMessagesParams): Promise<GroupMessagesResult> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    const groupConversation = await conversationService.getGroupConversation({ group_id }, client);

    const messages = await messageRepo.getConversationMessages(
      { conversation_id: groupConversation.id, last_message_id },
      client
    );

    await client.query('COMMIT');
    return { conversation: groupConversation, messages };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getDirectMessages({
  user1_id,
  user2_id,
  last_message_id,
}: GetDirectMessagesParams): Promise<DirectMessagesResult> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    const directConversation = await conversationService.getDirectConversation(
      { user1_id, user2_id },
      client
    );

    const messages = directConversation
      ? await messageRepo.getConversationMessages(
          { conversation_id: directConversation.id, last_message_id },
          client
        )
      : [];

    await client.query('COMMIT');
    return { conversation: directConversation ?? null, messages };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getMessage({ id }: { id: number }): Promise<MessageRow> {
  const message = await messageRepo.getMessage({ id });

  if (!message) throw new NotFoundError('Message not found');

  return message;
}

export async function updateMessage(params: UpdateMessageParams): Promise<void> {
  const updated = await messageRepo.updateMessage(params);

  if (!updated) throw new Error('Message could not be updated');
}

export async function deleteMessage(params: DeleteMessageParams): Promise<void> {
  const deleted = await messageRepo.deleteMessage(params);

  if (!deleted) throw new Error('Message could not be deleted');
}
