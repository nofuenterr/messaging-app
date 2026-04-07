import type { FriendshipStatus, RequestDirection } from './user.types.js';

export interface FriendshipRow {
  user_created: Date;
  display_name: string | null;
  username: string;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
  other_user_id: number;
  friendship_created: Date;
  friendship_status: FriendshipStatus;
  request_direction: RequestDirection;
}

export interface MutualGroupRow {
  id: number;
  created: Date;
  group_name: string;
  group_description: string | null;
  avatar_color: string;
  avatar_url: string | null;
  banner_url: string | null;
}

export interface GetFriendshipParams {
  user_id: number;
}

export interface GetMutualGroupsParams {
  user1_id: number;
  user2_id: number;
}

export interface GetMutualFriendsParams {
  user1_id: number;
  user2_id: number;
}

export interface RemoveFriendshipParams {
  requester_id: number;
  receiver_id: number;
}

export interface SendFriendRequestParams {
  requester_id: number;
  receiver_id: number;
}

export interface AcceptFriendRequestParams {
  requester_id: number;
  receiver_id: number;
}

export interface DeclineFriendRequestParams {
  requester_id: number;
  receiver_id: number;
}
