export interface BlockedUser {
  blocked_user_id: number;
  display_name: string | null;
  username: string;
  avatar_color: string;
  avatar_url: string;
  banner_url: string;
  blocked: string;
}
