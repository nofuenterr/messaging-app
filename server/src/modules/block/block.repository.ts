import pool from '../../config/database.js';

export async function addToBlockList({ user_id, blocked_user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    INSERT INTO user_block (
      user_id,
      blocked_user_id
    )
    VALUES ($1, $2)
    RETURNING
      user_id,
      blocked_user_id;
    `,
    [user_id, blocked_user_id]
  );

  return rows.length > 0;
}

export async function removeFromBlockList({ user_id, unblocked_user_id }) {
  const { rows } = await pool.query(
    `
    DELETE FROM user_block
    WHERE user_id = $1
      AND blocked_user_id = $2
    RETURNING
      user_id,
      blocked_user_id;
    `,
    [user_id, unblocked_user_id]
  );

  return rows.length > 0;
}

export async function getBlockList({ user_id }) {
  const { rows } = await pool.query(
    `
    SELECT
      u.id AS blocked_user_id,
      u.display_name,
      u.username,
      u.avatar_color,
      u.avatar_url,
      u.banner_url,
      ub.blocked

    FROM user_block AS ub

    JOIN users_safe AS u
      ON u.id = ub.blocked_user_id

    WHERE ub.user_id = $1
      AND u.deleted IS NULL

    ORDER BY ub.blocked DESC;
    `,
    [user_id]
  );
  return rows;
}
