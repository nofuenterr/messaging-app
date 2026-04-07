export type MessageType = 'text' | 'system';
export type SystemEventType =
  | 'user_join'
  | 'user_leave'
  | 'user_kick'
  | 'group_rename'
  | 'group_create'
  | 'user_pin';
export type ConversationType = 'direct' | 'group';

// --- DB row types ---

export interface DBMessage {
  id: number;
  sent_at: Date;
  author_id: number | null;
  conversation_id: number;
  reply_to: number | null;
  message_type: MessageType;
  system_event_type: SystemEventType | null;
  content: string;
  last_edited: Date | null;
  deleted: Date | null;
}

export interface MessageRow {
  message_id: number;
  sent_at: Date;
  content: string | null;
  message_type: MessageType;
  system_event_type: SystemEventType | null;
  replied_message_id: number | null;
  replied_message_content: string | null;
  replied_message_deleted: Date | null;
  replied_message_last_edited: Date | null;
  replied_message_author_name: string | null;
  replied_message_author_id: number | null;
  last_edited: Date | null;
  deleted: Date | null;
  author_id: number | null;
  display_name: string | null;
  pronouns: string | null;
  username: string | null;
  avatar_color: string | null;
  avatar_url: string | null;
  banner_url: string | null;
}

export interface CreatedMessage {
  id: number;
  conversation_id: number;
  author_id: number | null;
  sent_at: Date;
  reply_to: number | null;
  content: string;
}

export interface DBConversation {
  id: number;
  created: Date;
  conversation_type: ConversationType;
  latest_message_id: number | null;
  group_id: number | null;
  user1_id: number | null;
  user2_id: number | null;
}

export interface ConversationWithLatestMessageRow {
  conversation_id: number;
  conversation_type: ConversationType;
  latest_message_id: number | null;
  group_id: number | null;
  sent_at: Date;
  author_id: number | null;
  author_display_name: string | null;
  content: string | null;
  deleted: Date | null;
  other_user_id: number | null;
  display_name: string;
  display_avatar_url: string | null;
  display_banner_url: string | null;
  display_avatar_color: string;
}

// --- Input/param types ---

export interface CreateMessageParams {
  author_id: number | null;
  conversation_id: number;
  reply_to_message_id?: number | null;
  message_type?: MessageType;
  system_event_type?: SystemEventType | null;
  content: string;
}

export interface CreateDirectMessageParams {
  author_id: number;
  other_user_id: number;
  reply_to_message_id?: number | null;
  message_type?: MessageType;
  system_event_type?: SystemEventType | null;
  content: string;
}

export interface GetConversationMessagesParams {
  conversation_id: number;
  last_message_id?: number | null;
}

export interface GetGroupMessagesParams {
  group_id: number;
  last_message_id?: number | null;
}

export interface GetDirectMessagesParams {
  user1_id: number;
  user2_id: number;
  last_message_id?: number | null;
}

export interface GetMessageParams {
  id: number;
}

export interface UpdateMessageParams {
  id: number;
  author_id: number;
  content: string;
}

export interface DeleteMessageParams {
  id: number;
  author_id: number;
}

// --- Return types ---

export interface GroupMessagesResult {
  conversation: DBConversation;
  messages: MessageRow[];
}

export interface DirectMessagesResult {
  conversation: DBConversation | null;
  messages: MessageRow[];
}
