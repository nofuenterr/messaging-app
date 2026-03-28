import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getReports,
  getReport,
  reviewReport,
  resolveReport,
  getUsers,
  deleteUser,
} from './admin.service';

export function useAdminReports() {
  return useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: getReports,
    retry: (count, error: any) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useAdminReport(id: number) {
  return useQuery({
    queryKey: ['admin', 'reports', id],
    queryFn: () => getReport(id),
    enabled: !!id,
    retry: (count, error: any) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useReviewReport(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reviewReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', id] });
    },
  });
}

export function useResolveReport(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => resolveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', id] });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getUsers,
    retry: (count, error: any) => {
      if (error?.response?.status === 401) return false;
      return count < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
