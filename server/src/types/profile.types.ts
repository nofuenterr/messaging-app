import type { MessageType, SystemEventType } from './message.types.js';

// --- Service param types ---

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

export interface GetFriendshipParams {
  user_id: number;
}

export interface GetBlockListParams {
  user_id: number;
}

export interface AddFriendByUsernameParams {
  current_user_id: number;
  username: string;
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

export interface UnfriendUserParams {
  requester_id: number;
  receiver_id: number;
}

export interface BlockUserParams {
  user_id: number;
  blocked_user_id: number;
}

export interface UnblockUserParams {
  user_id: number;
  unblocked_user_id: number;
}

export interface UpsertNoteParams {
  user_id: number;
  noted_user_id: number;
  content: string;
}

export interface GetDirectMessagesParams {
  user1_id: number;
  user2_id: number;
  last_message_id?: number;
}

export interface CreateDirectMessageParams {
  author_id: number;
  other_user_id: number;
  reply_to_message_id?: number;
  message_type?: MessageType;
  system_event_type?: SystemEventType;
  content: string;
}

export interface UpdateDirectMessageParams {
  id: number;
  author_id: number;
  content: string;
}

export interface DeleteDirectMessageParams {
  id: number;
  author_id: number;
}

export interface GetUserProfileParams {
  id: number;
  current_user_id: number;
}

// --- Controller request body types ---

export interface UpdateUserProfileBody {
  display_name?: string;
  pronouns?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
}

export interface UpdateUsernameBody {
  username: string;
}

export interface UpsertNoteBody {
  content: string;
}

export interface CreateDirectMessageBody {
  reply_to_message_id?: number;
  message_type?: MessageType;
  system_event_type?: Extract<SystemEventType, 'user_pin'>;
  content: string;
}

export interface UpdateDirectMessageBody {
  content: string;
}

// --- Response types ---

export interface UserProfileResponse {
  user: import('./user.types.js').UserWithRelations;
  note: import('./note.types.js').NoteRow | undefined;
  mutualGroups: import('./friendship.types.js').MutualGroupRow[];
  mutualFriends: import('./user.types.js').SafeUser[];
}
