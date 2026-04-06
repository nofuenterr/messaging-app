import pool from '../../config/database.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';
import * as conversationService from '../conversation/conversation.service.js';

import * as messageRepo from './message.repository.js';

export async function createMessage(
  { author_id, conversation_id, reply_to_message_id, message_type, system_event_type, content },
  client?
) {
  const message = await messageRepo.createMessage(
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

  if (!message) {
    throw new Error('Message not created');
  }

  return message;
}

export async function createGroupMessage(
  { author_id, conversation_id, reply_to_message_id, message_type, system_event_type, content },
  client?
) {
  return createMessage(
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
}

export async function createDirectMessage({
  author_id,
  other_user_id,
  reply_to_message_id,
  message_type,
  system_event_type,
  content,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const conversation_id = await conversationService.getOrCreateDirectConversation(
      {
        user1_id: author_id,
        user2_id: other_user_id,
      },
      client
    );

    const message = createMessage(
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

export async function getConversationMessages({ conversation_id, last_message_id }) {
  return messageRepo.getConversationMessages({ conversation_id, last_message_id });
}

export async function getGroupMessages({ group_id, last_message_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const groupConversation = await conversationService.getGroupConversation({ group_id }, client);

    const groupMessages = await messageRepo.getConversationMessages(
      {
        conversation_id: groupConversation.id,
        last_message_id,
      },
      client
    );

    await client.query('COMMIT');

    return { conversation: groupConversation, messages: groupMessages };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getDirectMessages({ user1_id, user2_id, last_message_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const directConversation = await conversationService.getDirectConversation(
      { user1_id, user2_id },
      client
    );
    let directMessages;

    if (directConversation) {
      directMessages = await messageRepo.getConversationMessages(
        {
          conversation_id: directConversation.id,
          last_message_id,
        },
        client
      );
    } else {
      directMessages = [];
    }

    await client.query('COMMIT');

    return { conversation: directConversation, messages: directMessages };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getMessage({ id }) {
  const message = await messageRepo.getMessage({ id });

  if (!message) {
    throw new NotFoundError('Message not found');
  }

  return message;
}

export async function updateMessage({ id, author_id, content }) {
  const isMessageUpdated = await messageRepo.updateMessage({ id, author_id, content });

  if (!isMessageUpdated) {
    throw new Error('Message not updated');
  }
}

export async function deleteMessage({ id, author_id }) {
  const isMessageDeleted = await messageRepo.deleteMessage({ id, author_id });

  if (!isMessageDeleted) {
    throw new Error('Message not deleted');
  }
}
