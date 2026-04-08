import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  getFriendship,
  addFriendByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  unfriendUser,
} from './friendship.service';

export function useFriendship() {
  return useQuery({
    queryKey: ['friendship'],
    queryFn: getFriendship,
    retry: (count, error: AxiosError) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useAddFriendByUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFriendByUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
    },
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useDeclineFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useUnfriendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfriendUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['friendship'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}
