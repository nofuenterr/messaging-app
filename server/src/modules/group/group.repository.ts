import pool from '../../config/database.js';

export async function createGroup({
  owner_id,
  group_name,
  group_description,
  avatar_color,
  avatar_url,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO groups (
      owner_id,
      group_name,
      group_description,
      avatar_color,
      avatar_url
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, group_name;
    `,
    [owner_id, group_name, group_description, avatar_color, avatar_url]
  );

  return rows[0];
}

export async function getGroups() {
  const { rows } = await pool.query(
    `
    SELECT
      g.id AS group_id,
      g.created AS group_created,
      g.group_name,
      g.avatar_color AS group_avatar_color,
      g.avatar_url AS group_avatar_url,
      g.group_description,

      u.id AS owner_id,
      u.display_name AS owner_display_name,
      u.username AS owner_username,
      u.avatar_color AS owner_avatar_color,
      u.avatar_url AS owner_avatar_url,

      COUNT(m.user_id) AS member_count

    FROM groups AS g

    LEFT JOIN users AS u
      ON g.owner_id = u.id

    LEFT JOIN membership AS m
      ON m.group_id = g.id
      AND m.left_at IS NULL

    WHERE g.deleted IS NULL

    GROUP BY g.id, u.id
    ORDER BY g.created DESC;
    `
  );

  return rows;
}

export async function getGroup({ id }) {
  const { rows } = await pool.query(
    `
    SELECT
      g.id AS group_id,
      g.created AS group_created,
      g.group_name,
      g.group_description,
      g.avatar_color AS group_avatar_color,
      g.avatar_url AS group_avatar_url,

      u.id AS owner_id,
      u.display_name AS owner_display_name,
      u.username AS owner_username,
      u.avatar_color AS owner_avatar_color,
      u.avatar_url AS owner_avatar_url

    FROM groups AS g
    LEFT JOIN users AS u
      ON g.owner_id = u.id
    WHERE g.id = $1
      AND g.deleted IS NULL
    LIMIT 1;
    `,
    [id]
  );

  return rows[0];
}

export async function getUserGroups({ user_id }) {
  const { rows } = await pool.query(
    `
    SELECT 
      g.id,
      g.created,
      g.owner_id,
      g.group_name,
      g.group_description,
      g.avatar_color,
      g.avatar_url,
      m.joined,
      m.membership_role
    FROM groups AS g
    JOIN membership AS m
      ON g.id = m.group_id
    WHERE m.user_id = $1
      AND m.left_at IS NULL
      AND g.deleted IS NULL
    ORDER BY m.joined DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function getGroupMembership({ user_id, group_id }) {
  const { rows } = await pool.query(
    `
    SELECT
      user_id,
      joined,
      group_nickname,
      group_pronouns,
      membership_role
    FROM membership
    WHERE group_id = $1
      AND user_id = $2
      AND left_at IS NULL
    LIMIT 1;
    `,
    [group_id, user_id]
  );

  return rows[0];
}

export async function getGroupMembers({ id }) {
  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.username,
      u.avatar_color,
      u.avatar_url,
      m.joined,
      m.group_nickname,
      m.group_pronouns,
      m.membership_role
    FROM users AS u
    JOIN membership AS m
      ON u.id = m.user_id
    WHERE m.group_id = $1
      AND m.left_at IS NULL
      AND u.deleted IS NULL;
    `,
    [id]
  );

  return rows;
}

export async function updateGroup({ id, group_name, group_description, avatar_url }) {
  const { rows } = await pool.query(
    `
    UPDATE groups
    SET group_name = $2,
        group_description = $3,
        avatar_url = $4
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id, group_name, group_description, avatar_url]
  );

  return rows.length > 0;
}

export async function deleteGroup({ id }) {
  const { rows } = await pool.query(
    `
    UPDATE groups
    SET deleted = NOW()
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id]
  );

  return rows.length > 0;
}

export async function joinGroup({ group_id, user_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      SELECT *
      FROM membership
      WHERE group_id = $1
        AND user_id = $2
      LIMIT 1;
      `,
      [group_id, user_id]
    );

    const membership = rows.length > 0;

    let join_success;

    if (membership) {
      const { rows } = await client.query(
        `
        UPDATE membership
        SET joined = NOW(),
          left_at = NULL
        WHERE group_id = $1
          AND user_id = $2
        RETURNING group_id, user_id;
        `,
        [group_id, user_id]
      );

      join_success = rows.length > 0;
    } else {
      const { rows } = await client.query(
        `
        INSERT INTO membership (
          group_id,
          user_id
        )
        VALUES ($1, $2)
        RETURNING group_id, user_id;
        `,
        [group_id, user_id]
      );

      join_success = rows.length > 0;
    }

    await client.query('COMMIT');

    return join_success;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function leaveGroup({ group_id, user_id }): Promise<void> {
  await pool.query(
    `
    UPDATE membership
    SET left_at = NOW()
    WHERE group_id = $1
      AND user_id = $2
    RETURNING group_id, user_id;
    `,
    [group_id, user_id]
  );
}
