import type { PoolClient } from 'pg';

import pool from '../../config/database.js';
import type {
  CreatedUser,
  CreateUserParams,
  DeleteUserParams,
  GetUserParams,
  SafeUser,
  UpdateUsernameParams,
  UpdateUserProfileParams,
  UserWithRelations,
} from '../../types/user.types.js';

export async function createUser(params: CreateUserParams): Promise<CreatedUser> {
  const { rows } = await pool.query<CreatedUser>(
    `
    INSERT INTO users (username, password_hash, avatar_color) 
    VALUES ($1, $2, $3)
    RETURNING id, username;
    `,
    [params.username, params.password_hash, params.avatar_color]
  );

  return rows[0];
}

export async function getUsers(): Promise<SafeUser[]> {
  const { rows } = await pool.query<SafeUser>(
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
      banner_url,
      user_role,
      deleted
    FROM users_safe
    ORDER BY created DESC;
    `
  );

  return rows;
}

export async function getUserByUsername(username: string): Promise<SafeUser | undefined> {
  const { rows } = await pool.query<SafeUser>(
    `
    SELECT *
    FROM users_safe AS u
    WHERE u.username = $1
    LIMIT 1;
    `,
    [username]
  );

  return rows[0];
}

export async function getUser(
  params: GetUserParams,
  client?: PoolClient
): Promise<UserWithRelations | undefined> {
  const db = client ?? pool;

  const { rows } = await db.query<UserWithRelations>(
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
      u.banner_url,
      u.deleted,

      CASE
        WHEN ub.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS is_blocked,

      CASE
        WHEN ubc.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS was_blocked,

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

    LEFT JOIN user_block AS ubc
      ON ubc.user_id = u.id
      AND ubc.blocked_user_id = $2

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
    [params.id, params.current_user_id]
  );

  return rows[0];
}

export async function updateUserProfile(params: UpdateUserProfileParams): Promise<boolean> {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET display_name = COALESCE($2, display_name),
        pronouns = COALESCE($3, pronouns),
        avatar_url = COALESCE($4, avatar_url),
        banner_url = COALESCE($5, banner_url),
        bio = COALESCE($6, bio)
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [
      params.id,
      params.display_name,
      params.pronouns,
      params.avatar_url,
      params.banner_url,
      params.bio,
    ]
  );

  return rows.length > 0;
}

export async function updateUsername(params: UpdateUsernameParams): Promise<boolean> {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET username = $2
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [params.id, params.username]
  );

  return rows.length > 0;
}

export async function deleteUser(params: DeleteUserParams): Promise<boolean> {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET deleted = NOW()
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [params.id]
  );

  return rows.length > 0;
}
