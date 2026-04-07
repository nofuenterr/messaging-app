export type UserRole = 'admin' | 'user';
export type MembershipRole = 'owner' | 'admin' | 'member';
export type FriendshipStatus = 'pending' | 'accepted' | 'declined';
export type RequestDirection = 'incoming' | 'outgoing';

// --- DB row types ---

export interface DBUser {
  id: number;
  created: Date;
  display_name: string | null;
  username: string;
  pronouns: string | null;
  bio: string | null;
  password_hash: string;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  user_role: UserRole;
  deleted: Date | null;
}

export interface SafeUser {
  id: number;
  created: Date;
  display_name: string | null;
  username: string;
  pronouns: string | null;
  bio: string | null;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  user_role: UserRole;
  deleted: Date | null;
}

export interface UserWithRelations extends SafeUser {
  is_blocked: boolean;
  was_blocked: boolean;
  friendship_status: FriendshipStatus | null;
  request_direction: RequestDirection | null;
}

export interface CreatedUser {
  id: number;
  username: string;
}

// --- Input/param types ---

export interface CreateUserParams {
  username: string;
  password_hash: string;
  avatar_color: string;
}

export interface GetUserParams {
  id: number;
  current_user_id: number;
}

export interface UpdateUserProfileParams {
  id: number;
  display_name?: string;
  pronouns?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
}

export interface UpdateUsernameParams {
  id: number;
  username: string;
}

export interface DeleteUserParams {
  id: number;
}
