import type { Group } from './group.types';

export type FriendshipStatus = 'pending' | 'accepted' | 'declined';
export type RequestDirection = 'incoming' | 'outgoing';

export interface Friendship {
  other_user_id: number;
  display_name: string | null;
  username: string;
  avatar_color: string;
  avatar_url: string;
  banner_url: string;
  friendship_created: string;
  friendship_status: FriendshipStatus;
  request_direction: RequestDirection;
}

export interface MutualGroup {
  id: Group['group_id'];
  created: Group['group_created'];
  group_name: Group['group_name'];
  group_description: Group['group_description'];
  avatar_color: Group['group_avatar_color'];
  avatar_url: Group['group_avatar_url'];
  banner_url: Group['group_banner_url'];
}
