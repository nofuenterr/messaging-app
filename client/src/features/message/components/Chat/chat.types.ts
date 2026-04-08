import type { UseMutationResult } from '@tanstack/react-query';

type BaseMessageInput = {
  content: string;
  reply_to_message_id?: number;
  message_type?: 'text' | 'system';
};

type DirectSystemEvent = 'user_pin';

type GroupSystemEvent =
  | 'user_join'
  | 'user_leave'
  | 'user_kick'
  | 'group_rename'
  | 'group_create'
  | 'user_pin';

export type DirectMessageInput = BaseMessageInput & {
  system_event_type?: DirectSystemEvent;
};

export type GroupMessageInput = BaseMessageInput & {
  system_event_type?: GroupSystemEvent;
};

type ChatMessageInput = BaseMessageInput & {
  system_event_type?: DirectSystemEvent | GroupSystemEvent;
};

export type CreateMessageMutation = UseMutationResult<unknown, Error, ChatMessageInput>;
