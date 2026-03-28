import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getDMMessages,
  createDMMessage,
  updateDMMessage,
  deleteDMMessage,
  getGroupMessages,
  createGroupMessage,
  updateGroupMessage,
  deleteGroupMessage,
} from './message.service';

// DMs
export function useDMMessages(id: number, lastMessageId?: number) {
  return useQuery({
    queryKey: ['messages', 'dm', id, lastMessageId],
    queryFn: () => getDMMessages(id, lastMessageId),
    enabled: !!id,
    retry: (count, error: any) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useCreateDMMessage(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createDMMessage>[1]) => createDMMessage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'dm', id] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useUpdateDMMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDMMessage,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'dm', userId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useDeleteDMMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDMMessage,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'dm', userId] });
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
    retry: (count, error: any) => {
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
