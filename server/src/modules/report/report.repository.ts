import pool from '../../config/database.js';
import type {
  ReportRow,
  CreateReportParams,
  GetReportParams,
  GetUserReportsParams,
  UpdateReportStatusParams,
} from '../../types/report.types.js';

export async function createReport({
  reporter_id,
  target_user_id,
  target_message_id,
  target_group_id,
  reason,
}: CreateReportParams): Promise<{ id: number } | undefined> {
  const { rows } = await pool.query<{ id: number }>(
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
    [
      reporter_id,
      target_user_id ?? null,
      target_message_id ?? null,
      target_group_id ?? null,
      reason,
    ]
  );

  return rows[0];
}

export async function getReports(): Promise<ReportRow[]> {
  const { rows } = await pool.query<ReportRow>(
    `
    SELECT
      r.*,
      reporter.username AS reporter_username,
      reporter.display_name AS reporter_display_name,
      reporter.avatar_color AS reporter_avatar_color,
      reporter.avatar_url AS reporter_avatar_url,
      reporter.banner_url AS reporter_banner_url,
      target_user.username AS target_username,
      target_user.display_name AS target_display_name,
      target_user.avatar_color AS target_avatar_color,
      target_user.avatar_url AS target_avatar_url,
      target_user.banner_url AS target_banner_url,
      m.content AS target_message_content,
      g.group_name AS target_group_name,
      g.avatar_color AS target_group_avatar_color,
      g.avatar_url AS target_group_avatar_url,
      g.banner_url AS target_group_banner_url
    FROM reports AS r
    LEFT JOIN users_safe AS reporter ON reporter.id = r.reporter_id
    LEFT JOIN users_safe AS target_user ON target_user.id = r.target_user_id
    LEFT JOIN messages AS m ON m.id = r.target_message_id
    LEFT JOIN groups AS g ON g.id = r.target_group_id
    ORDER BY r.reported_at DESC;
    `
  );

  return rows;
}

export async function getUserReports({ user_id }: GetUserReportsParams): Promise<ReportRow[]> {
  const { rows } = await pool.query<ReportRow>(
    `
    SELECT
      r.*,
      reporter.username AS reporter_username,
      reporter.display_name AS reporter_display_name,
      reporter.avatar_color AS reporter_avatar_color,
      reporter.avatar_url AS reporter_avatar_url,
      reporter.banner_url AS reporter_banner_url,
      target_user.username AS target_username,
      target_user.display_name AS target_display_name,
      target_user.avatar_color AS target_avatar_color,
      target_user.avatar_url AS target_avatar_url,
      target_user.banner_url AS target_banner_url,
      m.content AS target_message_content,
      g.group_name AS target_group_name,
      g.avatar_color AS target_group_avatar_color,
      g.avatar_url AS target_group_avatar_url,
      g.banner_url AS target_group_banner_url
    FROM reports AS r
    LEFT JOIN users_safe AS reporter ON reporter.id = r.reporter_id
    LEFT JOIN users_safe AS target_user ON target_user.id = r.target_user_id
    LEFT JOIN messages AS m ON m.id = r.target_message_id
    LEFT JOIN groups AS g ON g.id = r.target_group_id
    WHERE r.reporter_id = $1
    ORDER BY r.reported_at DESC;
    `,
    [user_id]
  );

  return rows;
}

export async function getReport({ id }: GetReportParams): Promise<ReportRow | undefined> {
  const { rows } = await pool.query<ReportRow>(
    `
    SELECT
      r.*,
      reporter.username AS reporter_username,
      reporter.display_name AS reporter_display_name,
      reporter.avatar_color AS reporter_avatar_color,
      reporter.avatar_url AS reporter_avatar_url,
      reporter.banner_url AS reporter_banner_url,
      target_user.username AS target_username,
      target_user.display_name AS target_display_name,
      target_user.avatar_color AS target_avatar_color,
      target_user.avatar_url AS target_avatar_url,
      target_user.banner_url AS target_banner_url,
      m.content AS target_message_content,
      g.group_name AS target_group_name,
      g.avatar_color AS target_group_avatar_color,
      g.avatar_url AS target_group_avatar_url,
      g.banner_url AS target_group_banner_url
    FROM reports AS r
    LEFT JOIN users_safe AS reporter ON reporter.id = r.reporter_id
    LEFT JOIN users_safe AS target_user ON target_user.id = r.target_user_id
    LEFT JOIN messages AS m ON m.id = r.target_message_id
    LEFT JOIN groups AS g ON g.id = r.target_group_id
    WHERE r.id = $1
    LIMIT 1;
    `,
    [id]
  );

  return rows[0];
}

export async function reviewReport({ id }: UpdateReportStatusParams): Promise<boolean> {
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

export async function resolveReport({ id }: UpdateReportStatusParams): Promise<boolean> {
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
