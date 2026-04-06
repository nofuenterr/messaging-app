import pool from '../../config/database.js';

export async function getFriendship({ user_id }) {
  const { rows } = await pool.query(
    `
    SELECT
      u.created AS user_created,
      u.display_name,
      u.username,
      u.avatar_color,
      u.avatar_url,
      u.banner_url,

      CASE
        WHEN f.requester_id = $1 THEN f.receiver_id
        ELSE f.requester_id
      END AS other_user_id,

      f.created AS friendship_created,
      f.friendship_status,

      CASE
        WHEN f.requester_id = $1 THEN 'outgoing'
        ELSE 'incoming'
      END AS request_direction

    FROM friendship AS f

    JOIN users_safe AS u
      ON u.id = CASE
        WHEN f.requester_id = $1 THEN f.receiver_id
        ELSE f.requester_id
      END

    WHERE (f.requester_id = $1 OR f.receiver_id = $1)
      AND u.deleted IS NULL

    ORDER BY f.created DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function getMutualGroups({ user1_id, user2_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    SELECT 
      g.id,
      g.created,
      g.group_name,
      g.group_description,
      g.avatar_color,
      g.avatar_url,
      g.banner_url
    FROM groups AS g
    JOIN membership AS m1
      ON g.id = m1.group_id
      AND m1.user_id = $1
      AND m1.left_at IS NULL
    JOIN membership AS m2
      ON g.id = m2.group_id
      AND m2.user_id = $2
      AND m2.left_at IS NULL
    WHERE g.deleted IS NULL
    ORDER BY g.created DESc;
    `,
    [user1_id, user2_id]
  );

  return rows;
}

export async function getMutualFriends({ user1_id, user2_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    WITH 
      user1_friends AS (
        SELECT
          CASE 
            WHEN requester_id = $1 
              THEN receiver_id
              ELSE requester_id
          END AS friend_id
        FROM friendship
        WHERE friendship_status = 'accepted'
          AND (requester_id = $1 OR receiver_id = $1)
      ),
      user2_friends AS (
        SELECT
          CASE 
            WHEN requester_id = $2 
              THEN receiver_id
              ELSE requester_id
          END AS friend_id
        FROM friendship
        WHERE friendship_status = 'accepted'
          AND (requester_id = $2 OR receiver_id = $2)
      )

    SELECT
      u.id,
      u.created,
      u.display_name,
      u.username,
      u.pronouns,
      u.bio,
      u.avatar_color,
      u.avatar_url,
      u.banner_url,
      u.user_role
    FROM users_safe AS u
    JOIN user1_friends AS u1f
      ON u.id = u1f.friend_id
    JOIN user2_friends AS u2f
      ON u.id = u2f.friend_id
    WHERE u.deleted IS NULL;
    `,
    [user1_id, user2_id]
  );

  return rows;
}

export async function removeFriendship({ requester_id, receiver_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    DELETE FROM friendship
    WHERE (requester_id = $1 OR receiver_id = $1)
      AND (requester_id = $2 OR receiver_id = $2)
    RETURNING
      requester_id,
      receiver_id;
    `,
    [requester_id, receiver_id]
  );

  return rows.length > 0;
}

export async function sendFriendRequest({ requester_id, receiver_id }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      SELECT *
      FROM friendship
      WHERE (requester_id = $1 OR requester_id = $2)
        AND (receiver_id = $1 OR receiver_id = $2)
      LIMIT 1;
      `,
      [requester_id, receiver_id]
    );

    const friendship = rows.length > 0;

    let friend_request_success;

    if (friendship) {
      const { rows } = await client.query(
        `
        UPDATE friendship
        SET friendship_status = 'pending'
        WHERE requester_id = $1
          AND receiver_id = $2
        RETURNING requester_id, receiver_id;
        `,
        [requester_id, receiver_id]
      );

      friend_request_success = rows.length > 0;
    } else {
      const { rows } = await client.query(
        `
        INSERT INTO friendship (
          requester_id,
          receiver_id,
          friendship_status
        )
        VALUES ($1, $2, 'pending')
        RETURNING requester_id, receiver_id;
        `,
        [requester_id, receiver_id]
      );

      friend_request_success = rows.length > 0;
    }

    await client.query('COMMIT');

    return friend_request_success;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function acceptFriendRequest({ requester_id, receiver_id }) {
  const { rows } = await pool.query(
    `
    UPDATE friendship
    SET friendship_status = 'accepted'
    WHERE requester_id = $1
      AND receiver_id = $2
    RETURNING
      requester_id,
      receiver_id;
    `,
    [requester_id, receiver_id]
  );

  return rows.length > 0;
}

export async function declineFriendRequest({ requester_id, receiver_id }) {
  const { rows } = await pool.query(
    `
    UPDATE friendship
    SET friendship_status = 'declined'
    WHERE requester_id = $1
      AND receiver_id = $2
    RETURNING
      requester_id,
      receiver_id;
    `,
    [requester_id, receiver_id]
  );

  return rows.length > 0;
}
