import pool from '../../config/database.js';

export async function createDMConversation({ dm_user1, dm_user2 }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: conversations } = await client.query(
      `
      INSERT INTO conversations (
        conversation_type,
        dm_user1,
        dm_user2
      )
      VALUES ('dm', $1, $2)
      RETURNING id;
      `,
      [dm_user1, dm_user2]
    );

    const conversation_id = conversations[0].id;

    await client.query(
      `
      INSERT INTO conversation_members (
        conversation_id, 
        user_id
      )
      VALUES 
        ($1, $2),
        ($1, $3)
      RETURNING 
        conversation_id, 
        user_id;
      `,
      [conversation_id, dm_user1, dm_user2]
    );

    await client.query('COMMIT');

    return conversation_id;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function createGroupConversation({ group_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: conversations } = await client.query(
      `
      INSERT INTO conversations (
        conversation_type,
        group_id
      )
      VALUES ('group', $1)
      RETURNING id;
      `,
      [group_id]
    );

    const conversation_id = conversations[0].id;

    await client.query(
      `
      INSERT INTO conversation_members (
        conversation_id, 
        user_id
      )
      SELECT 
        $1, 
        user_id
      FROM membership
      WHERE group_id = $2
        AND left_at IS NULL
      RETURNING 
        conversation_id, 
        user_id;
      `,
      [conversation_id, group_id]
    );

    await client.query('COMMIT');

    return conversation_id;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getDMConversation({ user1_id, user2_id }) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM conversations
    WHERE conversation_type = 'dm'
    AND (
      (dm_user1 = $1 AND dm_user2 = $2)
      OR
      (dm_user1 = $2 AND dm_user2 = $1)
    )
    LIMIT 1;
    `,
    [user1_id, user2_id]
  );

  return rows[0];
}

export async function getGroupConversation({ group_id }) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM conversations
    WHERE group_id = $1
      AND conversation_type = 'group'
    LIMIT 1;
    `,
    [group_id]
  );

  return rows[0];
}

export async function getUserConversationsWithLatestMessage({ user_id }) {
  const { rows } = await pool.query(
    `
    SELECT
      c.id AS conversation_id,
      c.conversation_type,
      c.latest_message_id,
      c.group_id,

      m.sent_at,
      m.author_id,
      m.deleted,

      u.id AS other_user_id,

      CASE
        WHEN c.conversation_type = 'group' THEN g.group_name
        ELSE COALESCE(u.display_name, u.username)
      END AS display_name,

      CASE
        WHEN c.conversation_type = 'group' THEN g.avatar_url
        ELSE u.avatar_url
      END AS display_avatar_url,

      CASE
        WHEN c.conversation_type = 'group' THEN g.avatar_color
        ELSE u.avatar_color
      END AS display_avatar_color

    FROM conversation_members cm

    JOIN conversations c
      ON cm.conversation_id = c.id
      AND cm.user_id = $1

    LEFT JOIN messages m
      ON c.latest_message_id = m.id

    LEFT JOIN users u
      ON u.id = CASE
        WHEN c.dm_user1 = $1 THEN c.dm_user2
        ELSE c.dm_user1
      END

    LEFT JOIN groups g
      ON g.id = c.group_id

    WHERE c.latest_message_id IS NOT NULL

    ORDER BY m.sent_at DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function insertGroupConversationMember({ conversation_id, user_id }) {
  const { rows } = await pool.query(
    `
    INSERT INTO conversation_members (
      conversation_id, 
      user_id
    )
    VALUES 
      ($1, $2)
    RETURNING 
      conversation_id, 
      user_id;
    `,
    [conversation_id, user_id]
  );

  return rows.length > 0;
}

export async function removeConversationMember({ conversation_id, user_id }) {
  const { rows } = await pool.query(
    `
    DELETE FROM conversation_members
    WHERE conversation_id = $1
      AND user_id = $2
    RETURNING
      conversation_id,
      user_id;
    `,
    [conversation_id, user_id]
  );

  return rows.length > 0;
}
