import type { MutualGroup } from './friendship.types';
import type { User } from './user.types';

export interface Group {
  group_id: number;
  group_created: string;
  group_name: string;
  group_description: string | null;
  group_avatar_color: string;
  group_avatar_url: string;
  group_banner_url: string;
  owner_id: number;
  owner_display_name: string | null;
  owner_username: string;
  owner_avatar_color: string;
  owner_avatar_url: string;
  owner_banner_url: string;
  member_count: number;
  joined?: string | null;
  membership_role?: 'owner' | 'admin' | 'member';
  group_display_name?: string | null;
  group_pronouns?: string | null;
}

export interface GroupMember {
  id: number;
  display_name: string | null;
  username: string;
  avatar_color: string;
  avatar_url: string;
  banner_url: string;
  joined: string;
  group_display_name: string | null;
  group_pronouns: string | null;
  membership_role: 'owner' | 'admin' | 'member';
}

export interface GroupDetail {
  info: Group;
  members: GroupMember[];
  membership: GroupMembership | null;
}

export interface GroupMembership {
  user_id: number;
  joined: string;
  left_at: string | null;
  group_display_name: string | null;
  group_pronouns: string | null;
  membership_role: 'owner' | 'admin' | 'member';
}

export interface UserGroupProfile {
  user: User & {
    is_blocked: boolean;
    was_blocked: boolean;
    friendship_status: 'pending' | 'accepted' | 'declined' | null;
    request_direction: 'incoming' | 'outgoing' | null;
    joined: GroupMembership['joined'];
    left_at: GroupMembership['left_at'];
    membership_role: GroupMembership['membership_role'];
  };
  note: { content: string } | null;
  mutualGroups: MutualGroup[];
  mutualFriends: Omit<User, 'deleted'>[];
}
