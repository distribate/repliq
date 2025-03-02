import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY } from '../queries/current-user-query.ts';
import { toast } from 'sonner';
import { updateUserFields } from '#queries/update-user-fields.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import { getUser } from '#helpers/get-user.ts';

export const UPDATE_FIELD_MUTATION_KEY = ['user-update-field'];

export const useUpdateCurrentUser = () => {
  const qc = useQueryClient();
  const { nickname } = getUser()

  const updateFieldMutation = useMutation({
    mutationKey: UPDATE_FIELD_MUTATION_KEY,
    mutationFn: async (values: any) => updateUserFields(values),
    onSuccess: async (data, variables) => {
      if (!data || 'error' in data) return toast.error('Произошла ошибка при обновлении.', {
        description: 'Повторите попытку позже',
      });

      qc.setQueryData(CURRENT_USER_QUERY_KEY,
        (prev: UserDetailed) => ({ ...prev, ...data, })
      );

      qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname),
        (prev: UserDetailed) => ({ ...prev, ...data, })
      )
    },
    onError: e => { throw new Error(e.message); },
  });

  return { updateFieldMutation };
};