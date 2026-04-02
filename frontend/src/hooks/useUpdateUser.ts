import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api';
import type { UpdateUserRequest } from '../types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => authApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate any user-related queries if we add them later
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
