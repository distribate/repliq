import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserSettings, updateUserSettings } from '#queries/update-user-settings.ts';
import { toast } from 'sonner';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '#queries/current-user-query.ts';

export const useUpdateUserSettings = () => {
  const qc = useQueryClient()
  
  const updateUserSettingsMutation = useMutation({
    mutationFn: async (values: UpdateUserSettings) => updateUserSettings(values),
    onSuccess: async (data) => {
      if (!data || "error" in data) return toast.error("Произошла ошибка", {
        description: "Повторите попытку позже"
      });
      
      return qc.setQueryData(CURRENT_USER_QUERY_KEY, (prev: CurrentUser) => ({
        ...prev,
        preferences: { ...prev.preferences, ...data }
      }))
    },
    onError: e => { throw new Error(e.message) }
  })
  
  return { updateUserSettingsMutation }
}