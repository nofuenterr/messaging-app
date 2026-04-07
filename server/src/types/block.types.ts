export interface BlockedUserRow {
  blocked_user_id: number;
  display_name: string | null;
  username: string;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  blocked: Date;
}

export interface AddToBlockListParams {
  user_id: number;
  blocked_user_id: number;
}

export interface RemoveFromBlockListParams {
  user_id: number;
  unblocked_user_id: number;
}

export interface GetBlockListParams {
  user_id: number;
}
