import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
} from './group.service';

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
    retry: (count, error: any) => {
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
    retry: (count, error: any) => {
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
    retry: (count, error: any) => {
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
    },
  });
}

export function useUpdateGroup(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateGroup>[1]) => updateGroup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
    },
  });
}

export function useUpdateGroupProfile(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateGroupProfile>[1]) =>
      updateGroupProfile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', id] });
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
