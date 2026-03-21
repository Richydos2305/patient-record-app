import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/mockApi';
import type { UpdateUserRequest } from '../types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => authApi.updateUser(data),
    onSuccess: () => {
      // Invalidate any user-related queries if we add them later
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
