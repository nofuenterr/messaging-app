export type MessageType = 'text' | 'system';
export type SystemEventType =
  | 'user_join'
  | 'user_leave'
  | 'user_kick'
  | 'group_rename'
  | 'group_create'
  | 'user_pin';
export type ConversationType = 'direct' | 'group';

export interface Message {
  message_id: number;
  sent_at: string;
  content: string | null;
  message_type: MessageType;
  system_event_type: SystemEventType | null;
  replied_message_id: number | null;
  replied_message_content: string | null;
  replied_message_author_name: string | null;
  replied_message_author_id: number | null;
  replied_message_last_edited: string | null;
  replied_message_deleted: string | null;
  last_edited: string | null;
  deleted: string | null;
  author_id: number | null;
  display_name: string | null;
  username: string | null;
  avatar_color: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  group_display_name: string | null;
}

export interface Conversation {
  id: number;
  created: string;
  conversation_type: ConversationType;
  latest_message_id: number | null;
  group_id?: number | null;
  user1_id?: number;
  user2_id?: number;
}

export interface ConversationWithLatestMessage {
  conversation_id: number;
  conversation_type: ConversationType;
  latest_message_id: number | null;
  group_id: number | null;
  sent_at: string;
  author_id: number | null;
  author_display_name: string | null;
  content: string | null;
  deleted: string | null;
  other_user_id: number | null;
  display_name: string;
  display_avatar_url: string;
  display_banner_url: string;
  display_avatar_color: string;
}

export interface MessagesData {
  conversation: Conversation;
  messages: Message[];
}

export interface CreateGroupMessage {
  content: string;
  reply_to_message_id?: number;
  message_type?: 'text' | 'system';
  system_event_type?:
    | 'user_join'
    | 'user_leave'
    | 'user_kick'
    | 'group_rename'
    | 'group_create'
    | 'user_pin';
}

export interface CreateDirectMessage {
  content: string;
  reply_to_message_id?: number;
  message_type?: 'text' | 'system';
  system_event_type?: 'user_pin';
}
