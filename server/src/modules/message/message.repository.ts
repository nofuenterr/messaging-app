import pool from '../../config/database.js';

export async function createMessage({
  author_id,
  conversation_id,
  reply_to_message_id,
  message_type = 'text',
  system_event_type,
  content,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: messages } = await client.query(
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
      RETURNING id, conversation_id, sent_at;
      `,
      [author_id, conversation_id, reply_to_message_id, message_type, system_event_type, content]
    );

    const message = messages[0];

    await client.query(
      `
      UPDATE conversations
      SET latest_message_id = $1
      WHERE id = $2;
      `,
      [message.id, message.conversation_id]
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
  const { rows } = await pool.query(
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
      u.username,
      u.display_name,
      u.avatar_color,
      u.avatar_url,

      c.id,
      c.conversation_type,

      mem.group_nickname

    FROM messages AS m

    LEFT JOIN users AS u
      ON u.id = m.author_id

    LEFT JOIN conversations AS c
      ON c.id = m.conversation_id

    LEFT JOIN membership AS mem
      ON mem.user_id = u.id
      AND mem.group_id = c.group_id
      AND mem.left_at IS NULL

    WHERE m.conversation_id = $1
      AND ($2 IS NULL OR m.id < $2)

    ORDER BY m.id DESC
    LIMIT 50;
    `,
    [conversation_id, last_message_id]
  );

  return rows;
}

export async function getMessage({ id }) {
  const { rows } = await pool.query(
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
      u.username,
      u.display_name,

      c.conversation_type,

      mem.group_nickname

    FROM messages AS m

    LEFT JOIN users AS u
      ON u.id = m.author_id

    LEFT JOIN conversations AS c
      ON c.id = m.conversation_id

    LEFT JOIN membership AS mem
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

export async function updateMessage({ id, author_id, content }) {
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

export async function deleteMessage({ id, author_id }) {
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
