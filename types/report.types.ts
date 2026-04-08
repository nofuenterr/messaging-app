export type ReportStatus = 'open' | 'reviewed' | 'resolved';

export interface Report {
  id: number;
  reported_at: string;
  reporter_id: number | null;
  reporter_username: string | null;
  reporter_display_name: string | null;
  reporter_avatar_color: string | null;
  reporter_avatar_url: string | null;
  reporter_banner_url: string | null;
  target_user_id: number | null;
  target_username: string | null;
  target_display_name: string | null;
  target_avatar_color: string | null;
  target_avatar_url: string | null;
  target_banner_url: string | null;
  target_message_id: number | null;
  target_message_content: string | null;
  target_group_id: number | null;
  target_group_name: string | null;
  target_group_avatar_color: string | null;
  target_group_avatar_url: string | null;
  target_group_banner_url: string | null;
  reason: string;
  report_status: ReportStatus;
}
