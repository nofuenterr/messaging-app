import pool from '../../config/database.js';

export async function createReport({
  reporter_id,
  target_user_id,
  target_message_id,
  target_group_id,
  reason,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO reports (
      reporter_id, 
      target_user_id, 
      target_message_id, 
      target_group_id, 
      reason
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `,
    [reporter_id, target_user_id, target_message_id, target_group_id, reason]
  );

  return rows[0];
}

export async function getReports() {
  const { rows } = await pool.query(
    `
    SELECT
      r.*,

      reporter.username AS reporter_username,
      reporter.display_name AS reporter_display_name,
      reporter.avatar_color AS reporter_avatar_color,
      reporter.avatar_url AS reporter_avatar_url,

      target_user.username AS target_username,
      target_user.display_name AS target_display_name,
      target_user.avatar_color AS target_avatar_color,
      target_user.avatar_url AS target_avatar_url,

      m.content AS target_message_content,

      g.group_name AS target_group_name,
      g.avatar_color AS target_group_avatar_color,
      g.avatar_url AS target_group_avatar_url

    FROM reports AS r

    LEFT JOIN users_safe AS reporter
      ON reporter.id = r.reporter_id

    LEFT JOIN users_safe AS target_user
      ON target_user.id = r.target_user_id

    LEFT JOIN messages AS m
      ON m.id = r.target_message_id

    LEFT JOIN groups AS g
      ON g.id = r.target_group_id

    ORDER BY r.reported_at DESC;
    `
  );

  return rows;
}

export async function getUserReports({ user_id }) {
  const { rows } = await pool.query(
    `
    SELECT
      r.*,

      reporter.username AS reporter_username,
      reporter.display_name AS reporter_display_name,
      reporter.avatar_color AS reporter_avatar_color,
      reporter.avatar_url AS reporter_avatar_url,

      target_user.username AS target_username,
      target_user.display_name AS target_display_name,
      target_user.avatar_color AS target_avatar_color,
      target_user.avatar_url AS target_avatar_url,

      m.content AS target_message_content,

      g.group_name AS target_group_name,
      g.avatar_color AS target_group_avatar_color,
      g.avatar_url AS target_group_avatar_url

    FROM reports AS r

    LEFT JOIN users_safe AS reporter
      ON reporter.id = r.reporter_id

    LEFT JOIN users_safe AS target_user
      ON target_user.id = r.target_user_id

    LEFT JOIN messages AS m
      ON m.id = r.target_message_id

    LEFT JOIN groups AS g
      ON g.id = r.target_group_id
    
    WHERE r.reporter_id = $1

    ORDER BY r.reported_at DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function getReport({ id }) {
  const { rows } = await pool.query(
    `
    SELECT
      r.*,

      reporter.username AS reporter_username,
      reporter.display_name AS reporter_display_name,
      reporter.avatar_color AS reporter_avatar_color,
      reporter.avatar_url AS reporter_avatar_url,

      target_user.username AS target_username,
      target_user.display_name AS target_display_name,
      target_user.avatar_color AS target_avatar_color,
      target_user.avatar_url AS target_avatar_url,

      m.content AS target_message_content,

      g.group_name AS target_group_name,
      g.avatar_color AS target_group_avatar_color,
      g.avatar_url AS target_group_avatar_url

    FROM reports AS r

    LEFT JOIN users_safe AS reporter
      ON reporter.id = r.reporter_id

    LEFT JOIN users_safe AS target_user
      ON target_user.id = r.target_user_id

    LEFT JOIN messages AS m
      ON m.id = r.target_message_id

    LEFT JOIN groups AS g
      ON g.id = r.target_group_id

    WHERE r.id = $1

    LIMIT 1;
    `,
    [id]
  );

  return rows[0];
}

export async function reviewReport({ id }) {
  const { rows } = await pool.query(
    `
    UPDATE reports
    SET report_status = 'reviewed'
    WHERE id = $1
    RETURNING id;
    `,
    [id]
  );

  return rows.length > 0;
}

export async function resolveReport({ id }) {
  const { rows } = await pool.query(
    `
    UPDATE reports
    SET report_status = 'resolved'
    WHERE id = $1
    RETURNING id;
    `,
    [id]
  );

  return rows.length > 0;
}
