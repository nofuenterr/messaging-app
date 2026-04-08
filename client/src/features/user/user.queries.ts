import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { User } from '../../../../types/user.types';

import {
  getCurrentUserProfile,
  getUserProfile,
  updateUserProfile,
  updateUsername,
} from './user.service';

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUserProfile,
    retry: (count, error: AxiosError) => {
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
    retry: (count, error: AxiosError) => {
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
    onSuccess: (_, { avatar_url: _avatar, banner_url: _banner, ...rest }) => {
      queryClient.setQueryData(['users', 'me'], (old: User | undefined) =>
        old ? { ...old, ...rest } : old
      );
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
