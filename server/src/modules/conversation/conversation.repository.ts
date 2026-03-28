import pool from '../../config/database.js';

export async function createDMConversation({ dm_user1, dm_user2 }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    INSERT INTO conversations (
      conversation_type,
      dm_user1,
      dm_user2
    )
    VALUES ('dm', $1::int, $2::int)
    ON CONFLICT (
      LEAST(dm_user1, dm_user2),
      GREATEST(dm_user1, dm_user2)
    )
    WHERE conversation_type = 'dm'
    DO NOTHING
    RETURNING id;
    `,
    [dm_user1, dm_user2]
  );

  let conversation_id;

  if (rows.length > 0) {
    conversation_id = rows[0].id;

    await db.query(
      `
      INSERT INTO conversation_members (
        conversation_id, 
        user_id
      )
      VALUES 
        ($1, $2),
        ($1, $3);
      `,
      [conversation_id, dm_user1, dm_user2]
    );

    return conversation_id;
  }

  const existing = await db.query(
    `
    SELECT id
    FROM conversations
    WHERE conversation_type = 'dm'
      AND LEAST(dm_user1, dm_user2) = LEAST($1::int, $2::int)
      AND GREATEST(dm_user1, dm_user2) = GREATEST($1::int, $2::int);
    `,
    [dm_user1, dm_user2]
  );

  return existing.rows[0].id;
}

export async function createGroupConversation({ group_id }, client?) {
  const db = client ?? pool;

  await client.query('BEGIN');

  const { rows: conversations } = await db.query(
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

  await db.query(
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

  return conversation_id;
}

export async function getDMConversation({ user1_id, user2_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    SELECT
      id,
      created,
      conversation_type,
      latest_message_id,
      dm_user1 AS current_user_id,
      dm_user2 AS other_user_id
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

export async function getGroupConversation({ group_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    SELECT
      id,
      created,
      conversation_type,
      latest_message_id,
      group_id
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

      CASE
        WHEN c.conversation_type = 'group' THEN c.group_id
        ELSE NULL
      END AS group_id,

      m.sent_at,
      m.author_id,

      CASE
        WHEN c.conversation_type = 'group' THEN 
          ma.group_display_name
        ELSE 
          ua.display_name
      END AS author_display_name,

      CASE
        WHEN m.deleted IS NOT NULL THEN NULL
        ELSE m.content
      END AS content,

      m.deleted,

      CASE
        WHEN c.conversation_type = 'dm' THEN u.id
        ELSE NULL
      END AS other_user_id,

      CASE
        WHEN c.conversation_type = 'group' THEN 
          COALESCE(NULLIF(g.group_name, ''), u.display_name)
        ELSE 
          u.display_name
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

    LEFT JOIN users_safe u
      ON u.id = CASE
        WHEN c.dm_user1 = $1 THEN c.dm_user2
        ELSE c.dm_user1
      END

    LEFT JOIN users_safe ua
      ON m.author_id = ua.id

    LEFT JOIN membership_safe ma
      ON ua.id = ma.user_id

    LEFT JOIN groups g
      ON g.id = c.group_id

    WHERE c.latest_message_id IS NOT NULL

    ORDER BY m.sent_at DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function insertGroupConversationMember({ conversation_id, user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
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

export async function removeConversationMember({ conversation_id, user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
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
