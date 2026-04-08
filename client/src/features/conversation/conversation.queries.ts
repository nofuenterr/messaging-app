import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getUserConversationsWithLatestMessage } from './conversation.service';

export function useConversationsWithLatestMessage() {
  return useQuery({
    queryKey: ['conversationsWithLatestMessage'],
    queryFn: getUserConversationsWithLatestMessage,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}
