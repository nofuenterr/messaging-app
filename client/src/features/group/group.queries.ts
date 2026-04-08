import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { GroupDetail } from '../../../../types/group.types';

import {
  getGroups,
  getUserGroups,
  getGroup,
  createGroup,
  updateGroup,
  updateGroupProfile,
  deleteGroup,
  joinGroup,
  leaveGroup,
  kickUser,
  setGroupMemberAsAdmin,
  setGroupAdminAsMember,
  getUserGroupProfile,
} from './group.service';

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUserGroups() {
  return useQuery({
    queryKey: ['groups', 'me'],
    queryFn: getUserGroups,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGroup(id: number) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: () => getGroup(id),
    enabled: !!id,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useUpdateGroup(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateGroup>[1]) => updateGroup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useUpdateGroupProfile(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateGroupProfile>[1]) =>
      updateGroupProfile(id, payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['groups', id], (old: GroupDetail | undefined) => ({
        ...old,
        ...variables,
      }));
      queryClient.invalidateQueries({ queryKey: ['groups', 'me'] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinGroup,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'group', id] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveGroup,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'group', id] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useKickUser(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => kickUser(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
      queryClient.invalidateQueries({ queryKey: ['conversationsWithLatestMessage'] });
    },
  });
}

export function useSetGroupMemberAsAdmin(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => setGroupMemberAsAdmin(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
    },
  });
}

export function useSetGroupAdminAsMember(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => setGroupAdminAsMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
    },
  });
}

export function useUserGroupProfile(id: number, userId: number) {
  return useQuery({
    queryKey: ['groups', id, 'users', userId],
    queryFn: () => getUserGroupProfile(id, userId),
    enabled: !!id && !!userId,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}
