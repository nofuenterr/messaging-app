import { useMutation, useQueryClient } from '@tanstack/react-query';

import { upsertNote } from './note.service';

export function useUpsertNote(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string }) => upsertNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}
