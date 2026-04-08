import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type CreateMessageMutation = UseMutationResult<
  unknown,
  AxiosError,
  { content: string; reply_to_message_id?: number }
>;
