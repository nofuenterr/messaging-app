export interface CreateDirectConversationParams {
  user1_id: number;
  user2_id: number;
}

export interface CreateGroupConversationParams {
  group_id: number;
}

export interface GetDirectConversationParams {
  user1_id: number;
  user2_id: number;
}

export interface GetGroupConversationParams {
  group_id: number;
}

export interface GetUserConversationsParams {
  user_id: number;
}

export interface InsertConversationMemberParams {
  conversation_id: number;
  user_id: number;
}

export interface RemoveConversationMemberParams {
  conversation_id: number;
  user_id: number;
}
