import pool from '../../config/database.js';

export async function createGroup(
  { owner_id, group_name, group_description, avatar_color },
  client?
) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    INSERT INTO groups (
      owner_id,
      group_name,
      group_description,
      avatar_color
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, group_name, group_description;
    `,
    [owner_id, group_name, group_description, avatar_color]
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
      g.banner_url AS group_banner_url,
      g.group_description,

      u.id AS owner_id,
      u.display_name AS owner_display_name,
      u.username AS owner_username,
      u.avatar_color AS owner_avatar_color,
      u.avatar_url AS owner_avatar_url,
      u.banner_url AS owner_banner_url,

      COUNT(m.user_id) AS member_count

    FROM groups AS g

    LEFT JOIN users_safe AS u
      ON g.owner_id = u.id

    LEFT JOIN membership AS m
      ON m.group_id = g.id
      AND m.joined IS NOT NULL
      AND m.left_at IS NULL

    WHERE g.deleted IS NULL

    GROUP BY 
      g.id,
      g.created,
      g.group_name,
      g.avatar_color,
      g.avatar_url,
      g.banner_url,
      g.group_description,
      u.id,
      u.display_name,
      u.username,
      u.avatar_color,
      u.avatar_url,
      u.banner_url
    ORDER BY g.created DESC;
    `
  );

  return rows;
}

export async function getGroup({ id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    SELECT
      g.id AS group_id,
      g.created AS group_created,
      g.group_name,
      g.group_description,
      g.avatar_color AS group_avatar_color,
      g.avatar_url AS group_avatar_url,
      g.banner_url AS group_banner_url,

      u.id AS owner_id,
      u.display_name AS owner_display_name,
      u.username AS owner_username,
      u.avatar_color AS owner_avatar_color,
      u.avatar_url AS owner_avatar_url,
      u.banner_url AS owner_banner_url

    FROM groups AS g
    LEFT JOIN users_safe AS u
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
      g.id AS group_id,
      g.created AS group_created,
      g.group_name,
      g.avatar_color AS group_avatar_color,
      g.avatar_url AS group_avatar_url,
      g.banner_url AS group_banner_url,
      g.group_description,

      u.id AS owner_id,
      u.display_name AS owner_display_name,
      u.username AS owner_username,
      u.avatar_color AS owner_avatar_color,
      u.avatar_url AS owner_avatar_url,
      u.banner_url AS owner_banner_url,

      m.joined,
      m.membership_role,
      m.group_display_name,
      m.group_pronouns,

      COUNT(m_all.user_id) AS member_count

    FROM groups AS g

    LEFT JOIN users_safe AS u
      ON g.owner_id = u.id

    JOIN membership AS m
      ON m.group_id = g.id
      and m.user_id = $1
      AND m.joined IS NOT NULL
      AND m.left_at IS NULL

    LEFT JOIN membership AS m_all
      ON m_all.group_id = g.id
      AND m_all.left_at IS NULL
      AND m_all.joined IS NOT NULL
      
    WHERE g.deleted IS NULL
    
    GROUP BY 
      g.id,
      g.created,
      g.group_name,
      g.avatar_color,
      g.avatar_url,
      g.banner_url,
      g.group_description,
      u.id,
      u.display_name,
      u.username,
      u.avatar_color,
      u.avatar_url,
      u.banner_url,
      m.joined,
      m.membership_role,
      m.group_display_name,
      m.group_pronouns

    ORDER BY m.joined DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function getGroupMembership({ user_id, group_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    SELECT
      user_id,
      joined,
      left_at,
      group_display_name,
      group_pronouns,
      membership_role
    FROM membership_safe
    WHERE group_id = $1
      AND user_id = $2
    LIMIT 1;
    `,
    [group_id, user_id]
  );

  return rows[0];
}

export async function getGroupMembers({ id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    SELECT
      u.id,
      u.display_name,
      u.username,
      u.avatar_color,
      u.avatar_url,
      u.banner_url,
      m.joined,
      m.group_display_name,
      m.group_pronouns,
      m.membership_role
    FROM users_safe AS u
    JOIN membership_safe AS m
      ON u.id = m.user_id
    WHERE m.group_id = $1
      AND m.left_at IS NULL
      AND u.deleted IS NULL;
    `,
    [id]
  );

  return rows;
}

export async function updateGroup(
  { id, group_name, group_description, avatar_url, banner_url },
  client?
) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    UPDATE groups
    SET group_name = $2,
        group_description = $3,
        avatar_url = $4,
        banner_url = $5
    WHERE id = $1
      AND deleted IS NULL
    RETURNING id;
    `,
    [id, group_name, group_description, avatar_url, banner_url]
  );

  return rows.length > 0;
}

export async function updateGroupProfile({
  group_id,
  user_id,
  group_display_name,
  group_pronouns,
}) {
  const { rows } = await pool.query(
    `
    UPDATE membership
    SET group_display_name = $3,
        group_pronouns = $4
    WHERE group_id = $1
      AND user_id = $2
      AND left_at IS NULL
    RETURNING group_id, user_id, group_display_name, group_pronouns;
    `,
    [group_id, user_id, group_display_name, group_pronouns]
  );

  return rows.length > 0;
}

export async function setGroupMemberAsAdmin({ group_id, user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    UPDATE membership
    SET membership_role = 'admin'
    WHERE group_id = $1
      AND user_id = $2
      AND membership_role = 'member'
      AND left_at IS NULL
    RETURNING group_id, user_id, membership_role;
    `,
    [group_id, user_id]
  );

  return rows.length > 0;
}

export async function setGroupAdminAsMember({ group_id, user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    UPDATE membership
    SET membership_role = 'member'
    WHERE group_id = $1
      AND user_id = $2
      AND membership_role = 'admin'
      AND left_at IS NULL
    RETURNING group_id, user_id, membership_role;
    `,
    [group_id, user_id]
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

export async function joinGroup({ group_id, user_id, membership_role = 'member' }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
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
    const { rows } = await db.query(
      `
      UPDATE membership
      SET joined = NOW(),
        left_at = NULL,
        membership_role = $3
      WHERE group_id = $1
        AND user_id = $2
      RETURNING group_id, user_id;
      `,
      [group_id, user_id, membership_role]
    );

    join_success = rows.length > 0;
  } else {
    const { rows } = await db.query(
      `
      INSERT INTO membership (
        group_id,
        user_id,
        membership_role
      )
      VALUES ($1, $2, $3)
      RETURNING group_id, user_id;
      `,
      [group_id, user_id, membership_role]
    );

    join_success = rows.length > 0;
  }

  return join_success;
}

export async function leaveGroup({ group_id, user_id }, client?) {
  const db = client ?? pool;

  const { rows } = await db.query(
    `
    UPDATE membership
    SET left_at = NOW()
    WHERE group_id = $1
      AND user_id = $2
    RETURNING group_id, user_id;
    `,
    [group_id, user_id]
  );

  return rows.length > 0;
}
