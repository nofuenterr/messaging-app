import type { MembershipRole } from './user.types.js';

export interface DBGroup {
  id: number;
  created: Date;
  owner_id: number | null;
  group_name: string;
  group_description: string | null;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  deleted: Date | null;
}

export interface GroupRow {
  group_id: number;
  group_created: Date;
  group_name: string;
  group_description: string | null;
  group_avatar_color: string;
  group_avatar_url: string | null;
  group_banner_url: string | null;
  owner_id: number | null;
  owner_display_name: string | null;
  owner_username: string | null;
  owner_avatar_color: string | null;
  owner_avatar_url: string | null;
  owner_banner_url: string | null;
  member_count: string;
  joined: Date | null;
  membership_role: MembershipRole | null;
  group_display_name: string | null;
  group_pronouns: string | null;
}

export interface GroupMemberRow {
  id: number;
  display_name: string | null;
  username: string;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  joined: Date;
  group_display_name: string | null;
  group_pronouns: string | null;
  membership_role: MembershipRole;
}

export interface GroupMembershipRow {
  user_id: number;
  joined: Date;
  left_at: Date | null;
  group_display_name: string | null;
  group_pronouns: string | null;
  membership_role: MembershipRole;
}

export interface CreatedGroup {
  id: number;
  group_name: string;
  group_description: string | null;
}

// --- Param types ---

export interface CreateGroupParams {
  owner_id: number;
  group_name: string;
  group_description?: string;
  avatar_color: string;
}

export interface GetGroupParams {
  id: number;
}

export interface GetUserGroupsParams {
  user_id: number;
}

export interface UpdateGroupParams {
  id: number;
  group_name: string;
  group_description?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
}

export interface UpdateGroupServiceParams extends UpdateGroupParams {
  current_user_id: number;
}

export interface UpdateGroupProfileParams {
  group_id: number;
  user_id: number;
  group_display_name?: string;
  group_pronouns?: string;
}

export interface JoinGroupParams {
  group_id: number;
  user_id: number;
  membership_role?: MembershipRole;
}

export interface LeaveGroupParams {
  group_id: number;
  user_id: number;
}

export interface KickGroupParams {
  current_user_id: number;
  group_id: number;
  user_id: number;
}

export interface SetGroupRoleParams {
  current_user_id: number;
  group_id: number;
  user_id: number;
}

export interface GetGroupMembershipParams {
  group_id: number;
  user_id: number;
}

export interface GetUserGroupProfileParams {
  id: number;
  current_user_id: number;
  group_id: number;
}

export interface DeleteGroupParams {
  id: number;
}

// --- Service-level createGroup params (includes file uploads) ---

export interface CreateGroupServiceParams {
  owner_id: number;
  owner_name: string;
  group_name: string;
  group_description?: string;
  avatar_file?: Express.Multer.File;
  banner_file?: Express.Multer.File;
  avatar_color: string;
}

export interface CreateGroupMessageServiceParams {
  author_id: number;
  group_id: number;
  reply_to_message_id?: number;
  message_type?: import('./message.types.js').MessageType;
  system_event_type?: import('./message.types.js').SystemEventType;
  content: string;
}

export interface GroupJoinLeaveServiceParams {
  group_id: number;
  user_id: number;
  name: string;
}

// --- Response types ---

export interface GroupDetailResult {
  info: GroupRow;
  members: GroupMemberRow[];
  membership: GroupMembershipRow | null;
}

export interface UserGroupProfileResult {
  user: import('./user.types.js').UserWithRelations & {
    joined: Date | null;
    left_at: Date | null;
    membership_role: MembershipRole | null;
  };
  note: import('./note.types.js').NoteRow | null;
  mutualGroups: import('./friendship.types.js').MutualGroupRow[];
  mutualFriends: import('./user.types.js').SafeUser[];
}
