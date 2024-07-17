import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER } from '@repo/types/entities/entities-type.ts';
import { updateUserFields } from '../queries/update-user-fields.ts';
import { CURRENT_USER_QUERY_KEY, currentUserQuery } from '../queries/current-user-query.ts';
import { REQUESTED_USER_QUERY_KEY } from '../queries/requested-user-query.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';

export type AvailableFields = Pick<USER, 'description'
  | 'visibility'
  | 'birthday'
  | 'name_color'
  | 'real_name'
>

export type UpdateCurrentUser = {
  field: keyof AvailableFields,
  value: string | null
}

export const useUpdateCurrentUser = () => {
  const qc = useQueryClient();
  
  const { data: currentUser } = currentUserQuery();
  
  const updateFieldMutation = useMutation({
    mutationFn: async(values: UpdateCurrentUser) => {
      if (!currentUser || values.value === null) return;
      
      const { field, value } = values;
      
      const fieldToUpdate: { [k: string]: string | null } = {
        [field as string]: value,
      };
      
      return updateUserFields({
        nickname: currentUser.nickname, id: currentUser.id, field: fieldToUpdate,
      });
    },
    onSuccess: async(data) => {
      if (!currentUser) return;
      
      await Promise.all([
        qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
        qc.invalidateQueries({ queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname) }),
      ]);
      
      if (!data) {
        toast({
          title: 'Произошла ошибка при обновлении. Повторите позже!', variant: 'negative',
        });
        
        return;
      }
      
      if (data.status === 200 && data) {
        toast({
          title: 'Изменения сохранены!', variant: 'positive',
        });
        
        return data;
      }
    },
    onError: (e) => { throw new Error(e.message) },
  });
  
  return { updateFieldMutation };
};