import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { UpdateUserFields, updateUserFields } from '../queries/update-user-fields.ts';
import { CURRENT_USER_QUERY_KEY } from '../queries/current-user-query.ts';
import { toast } from 'sonner';
import { DONATE_QUERY_KEY } from '@repo/components/src/user/components/donate/queries/donate-query.ts';
import { parseStringToBoolean } from '../helpers/parse-string-to-boolean.ts';
import { getUser } from '#helpers/get-user.ts';
import {
  REQUESTED_USER_QUERY_KEY
} from '@repo/components/src/profile/components/cover/queries/requested-user-query.ts';

export type UpdateAvailableFields = Pick<UserEntity,
  | 'description' | 'visibility' | 'birthday' | 'name_color' | 'favorite_item' | 'real_name' | 'preferences'
>

export type UpdateCurrentUser = {
  field: keyof UpdateAvailableFields,
  value: string,
  preferences?: Omit<Extract<UpdateUserFields['preferences'], object>, 'oldPreferences'>
}

export const UPDATE_FIELD_MUTATION_KEY = ["user-update-field"]

export const useUpdateCurrentUser = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const updateFieldMutation = useMutation({
    mutationKey: UPDATE_FIELD_MUTATION_KEY,
    mutationFn: async(values: UpdateCurrentUser) => {
      if (!currentUser) return;
      
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
            oldPreferences: currentUser.preferences,
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
      
      if (!data) return toast.error("Произошла ошибка при обновлении.", {
        description: 'Повторите попытку позже',
      });
      
      if (data.status === 200 && data) {
        toast.success("Изменения применены");
        
        await Promise.all([
          qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
          qc.invalidateQueries({ queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: DONATE_QUERY_KEY(currentUser.nickname) }),
        ]);
        
        return data;
      }
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { updateFieldMutation };
};