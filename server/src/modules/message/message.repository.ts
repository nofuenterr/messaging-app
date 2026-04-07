import type { PoolClient } from 'pg';

import pool from '../../config/database.js';
import type {
  CreateMessageParams,
  CreatedMessage,
  MessageRow,
  GetConversationMessagesParams,
} from '../../types/message.types.js';

export async function createMessage(
  {
    author_id,
    conversation_id,
    reply_to_message_id,
    message_type = 'text',
    system_event_type,
    content,
  }: CreateMessageParams,
  client?: PoolClient
): Promise<CreatedMessage> {
  const db = client ?? pool;

  const { rows: messages } = await db.query<CreatedMessage>(
    `
    INSERT INTO messages (
      author_id,
      conversation_id,
      reply_to,
      message_type,
      system_event_type,
      content 
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, conversation_id, author_id, sent_at, reply_to, content;
    `,
    [author_id, conversation_id, reply_to_message_id, message_type, system_event_type, content]
  );

  const message = messages[0];

  await db.query(
    `
    UPDATE conversations
    SET latest_message_id = $1
    WHERE id = $2;
    `,
    [message.id, message.conversation_id]
  );

  return message;
}

export async function getConversationMessages(
  { conversation_id, last_message_id }: GetConversationMessagesParams,
  client?: PoolClient
): Promise<MessageRow[]> {
  const db = client ?? pool;

  const { rows } = await db.query<MessageRow>(
    `
    SELECT
      m.id AS message_id,
      m.sent_at,

      CASE
        WHEN m.deleted IS NOT NULL THEN NULL
        ELSE m.content
      END AS content,

      m.message_type,
      m.system_event_type,
      m.last_edited,
      m.deleted,

      rm.id AS replied_message_id,
      CASE
        WHEN rm.deleted IS NOT NULL THEN NULL
        ELSE rm.content
      END AS replied_message_content,
      rm.deleted AS replied_message_deleted,
      rm.last_edited AS replied_message_last_edited,

      CASE
        WHEN c.conversation_type = 'group' THEN rmem.group_display_name
        ELSE ru.display_name
      END AS replied_message_author_name,

      ru.id AS replied_message_author_id,

      u.id AS author_id,

      CASE
        WHEN c.conversation_type = 'group' THEN mem.group_display_name
        ELSE u.display_name
      END AS display_name,

      CASE
        WHEN c.conversation_type = 'group' THEN mem.group_pronouns
        ELSE u.pronouns
      END AS pronouns,

      u.username,
      u.avatar_color,
      u.avatar_url,
      u.banner_url,

      c.id,
      c.conversation_type

    FROM messages AS m

    LEFT JOIN users_safe AS u
      ON u.id = m.author_id

    LEFT JOIN conversations AS c
      ON c.id = m.conversation_id

    LEFT JOIN membership_safe AS mem
      ON mem.user_id = u.id
      AND mem.group_id = c.group_id
      AND mem.left_at IS NULL

    LEFT JOIN messages AS rm
      ON rm.id = m.reply_to

    LEFT JOIN users_safe AS ru
      ON ru.id = rm.author_id

    LEFT JOIN membership_safe AS rmem
      ON rmem.user_id = ru.id
      AND rmem.group_id = c.group_id
      AND rmem.left_at IS NULL

    WHERE m.conversation_id = $1
      AND ($2::int IS NULL OR m.id < $2::int)

    ORDER BY m.id DESC
    LIMIT 50;
    `,
    [conversation_id, last_message_id]
  );

  return rows;
}

export async function getMessage({ id }: { id: number }): Promise<MessageRow | undefined> {
  const { rows } = await pool.query<MessageRow>(
    `
    SELECT
      m.id,
      m.sent_at,
      m.content,
      m.message_type,
      m.system_event_type,
      m.reply_to,
      m.last_edited,
      m.deleted,

      u.id AS author_id,
      u.display_name,
      u.username,

      c.conversation_type,

      mem.group_display_name

    FROM messages AS m

    LEFT JOIN users_safe AS u
      ON u.id = m.author_id

    LEFT JOIN conversations AS c
      ON c.id = m.conversation_id

    LEFT JOIN membership_safe AS mem
      ON mem.user_id = u.id
      AND mem.group_id = c.group_id
      AND mem.left_at IS NULL

    WHERE m.id = $1
    LIMIT 1;
    `,
    [id]
  );

  return rows[0];
}

export async function updateMessage({
  id,
  author_id,
  content,
}: {
  id: number;
  author_id: number;
  content: string;
}): Promise<boolean> {
  const { rows } = await pool.query(
    `
    UPDATE messages
    SET content = $3,
        last_edited = NOW()
    WHERE id = $1
      AND author_id = $2
    RETURNING id, last_edited;
    `,
    [id, author_id, content]
  );

  return rows.length > 0;
}

export async function deleteMessage({
  id,
  author_id,
}: {
  id: number;
  author_id: number;
}): Promise<boolean> {
  const { rows } = await pool.query(
    `
    UPDATE messages
    SET deleted = NOW()
    WHERE id = $1
      AND author_id = $2
    RETURNING id, deleted;
    `,
    [id, author_id]
  );

  return rows.length > 0;
}
