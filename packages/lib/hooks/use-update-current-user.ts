import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UpdateUserFields,
  updateUserFields,
} from '../queries/update-user-fields.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '../queries/current-user-query.ts';
import { toast } from 'sonner';

export const UPDATE_FIELD_MUTATION_KEY = [ 'user-update-field' ];

export const useUpdateCurrentUser = () => {
  const qc = useQueryClient();
  
  const updateFieldMutation = useMutation({
    mutationKey: UPDATE_FIELD_MUTATION_KEY,
    mutationFn: async(values: UpdateUserFields) => updateUserFields(values),
    onSuccess: async(data, variables) => {
      console.log(data, variables)
      
      if (!data || 'error' in data) return toast.error('Произошла ошибка при обновлении.', {
        description: 'Повторите попытку позже',
      });
      
      return qc.setQueryData(CURRENT_USER_QUERY_KEY,
        (prev: CurrentUser) => ({ ...prev, ...data, })
      );
    },
    onError: e => {throw new Error(e.message);},
  });
  
  return { updateFieldMutation };
};