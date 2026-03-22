import pool from '../../config/database.js';

export async function createUser({ username, password_hash, avatar_color }) {
  const { rows } = await pool.query(
    `
    INSERT INTO users (username, password_hash, avatar_color) 
    VALUES ($1, $2, $3)
    RETURNING id, username;
    `,
    [username, password_hash, avatar_color]
  );

  return rows[0];
}

export async function getUsers() {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      created,
      display_name,
      username,
      pronouns,
      bio,
      avatar_color,
      avatar_url,
      user_role,
      deleted
    FROM users_safe
    ORDER BY created DESC;
    `
  );

  return rows;
}

export async function getUser({ id, current_user_id }) {
  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.created,
      u.display_name,
      u.username,
      u.pronouns,
      u.bio,
      u.avatar_color,
      u.avatar_url,
      u.deleted,

      CASE
        WHEN ub.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS is_blocked,

      f.friendship_status,
      CASE
        WHEN f.requester_id = $2 THEN 'outgoing'
        WHEN f.receiver_id = $2 THEN 'incoming'
        ELSE NULL
      END AS request_direction

    FROM users_safe AS u

    LEFT JOIN user_block AS ub
      ON ub.user_id = $2
      AND ub.blocked_user_id = u.id

    LEFT JOIN LATERAL (
      SELECT *
      FROM friendship
      WHERE (requester_id = u.id AND receiver_id = $2)
        OR (receiver_id = u.id AND requester_id = $2)
      ORDER BY created DESC
      LIMIT 1
    ) AS f ON TRUE

    WHERE u.id = $1
    LIMIT 1;
    `,
    [id, current_user_id]
  );

  return rows[0];
}

export async function updateUserProfile({ id, display_name, pronouns, avatar_url, bio }) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET display_name = COALESCE($2, display_name),
        pronouns = COALESCE($3, pronouns),
        avatar_url = COALESCE($4, avatar_url),
        bio = COALESCE($5, bio)
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id, display_name, pronouns, avatar_url, bio]
  );

  return rows.length > 0;
}

export async function updateUsername({ id, username }) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET username = $2
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id, username]
  );

  return rows.length > 0;
}

export async function updateUserAvatar({ id, avatar_url }) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET avatar_url = $2
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id, avatar_url]
  );

  return rows.length > 0;
}

export async function deleteUser({ id }) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET deleted = NOW()
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id]
  );

  return rows.length > 0;
}
