import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getCurrentUserProfile,
  getUserProfile,
  updateUserProfile,
  updateUsername,
  updateUserAvatar,
} from './user.service';

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUserProfile,
    retry: (count, error: any) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUserProfile(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserProfile(id),
    enabled: !!id,
    retry: (count, error: any) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_, variables) => {
      const { avatar_url, ...rest } = variables;
      queryClient.setQueryData(['users', 'me'], (old: any) => ({
        ...old,
        ...rest,
      }));
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

export function useUpdateUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

export function useUpdateUserAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}
