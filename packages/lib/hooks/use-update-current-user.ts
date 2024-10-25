import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { UpdateUserFields, updateUserFields } from '../queries/update-user-fields.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '../queries/current-user-query.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import { DONATE_QUERY_KEY } from '@repo/components/src/user/components/donate/queries/donate-query.ts';
import { parseStringToBoolean } from '../helpers/parse-string-to-boolean.ts';
import {
  REQUESTED_USER_QUERY_KEY,
} from '@repo/components/src/profile/components/cover/cover/queries/requested-user-query.ts';

export type AvailableFields = Pick<UserEntity, 'description'
  | 'visibility'
  | 'birthday'
  | 'name_color'
  | 'favorite_item'
  | 'real_name'
  | 'preferences'
>

export type UpdateCurrentUser = {
  field: keyof AvailableFields,
  value: string | null,
  preferences?: Omit<Extract<UpdateUserFields['preferences'], object>, 'oldPreferences'>
}

export const useUpdateCurrentUser = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(
    CURRENT_USER_QUERY_KEY
  );
  
  const updateFieldMutation = useMutation({
    mutationFn: async(values: UpdateCurrentUser) => {
      if (!currentUser || values.value === null) return;
      
      const { field, value, preferences } = values;
      
      const fieldToUpdate: { [k: string]: string | null } = {
        [field as string]: value,
      };
      
      if (preferences) {
        return updateUserFields({
          nickname: currentUser.nickname,
          id: currentUser.id,
          field: fieldToUpdate,
          preferences: {
            key: preferences?.key,
            value: parseStringToBoolean(value),
            oldPreferences: currentUser.properties.preferences,
          },
        });
      } else {
        return updateUserFields({
          nickname: currentUser.nickname,
          id: currentUser.id,
          field: fieldToUpdate,
        });
      }
    },
    onSuccess: async(data) => {
      if (!currentUser) return;
      
      await Promise.all([
        qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
        qc.invalidateQueries({ queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname) }),
        qc.invalidateQueries({ queryKey: DONATE_QUERY_KEY(currentUser.nickname) }),
      ]);
      
      if (!data) return toast({
        title: 'Произошла ошибка при обновлении. Повторите позже!',
        variant: 'negative',
      });
      
      if (data.status === 200 && data) {
        toast({
          title: 'Изменения применены',
          variant: 'positive',
        });
        
        return data;
      }
      
      if (data.status === 400 && data.data === 'Timeout') {
        toast({
          title: 'Слишком частое изменение поля', variant: 'negative',
        });
        
        return data;
      }
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { updateFieldMutation };
};