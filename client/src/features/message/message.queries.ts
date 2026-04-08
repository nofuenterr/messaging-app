import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  getDirectMessages,
  createDirectMessage,
  updateDirectMessage,
  deleteDirectMessage,
  getGroupMessages,
  createGroupMessage,
  updateGroupMessage,
  deleteGroupMessage,
} from './message.service';

// Direct
export function useDirectMessages(id: number, lastMessageId?: number) {
  return useQuery({
    queryKey: ['messages', 'direct', id, lastMessageId],
    queryFn: () => getDirectMessages(id, lastMessageId),
    enabled: !!id,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useCreateDirectMessage(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createDirectMessage>[1]) =>
      createDirectMessage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'direct', id] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useUpdateDirectMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDirectMessage,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'direct', userId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useDeleteDirectMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDirectMessage,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'direct', userId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

// Group Messages
export function useGroupMessages(groupId: number, lastMessageId?: number) {
  return useQuery({
    queryKey: ['messages', 'group', groupId, lastMessageId],
    queryFn: () => getGroupMessages(groupId, lastMessageId),
    enabled: !!groupId,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useCreateGroupMessage(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createGroupMessage>[1]) =>
      createGroupMessage(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useUpdateGroupMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupMessage,
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useDeleteGroupMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroupMessage,
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}
