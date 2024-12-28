import { REQUESTED_USER_QUERY_KEY } from '@repo/components/src/profile/components/cover/queries/requested-user-query.ts';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserSettings, updateUserSettings } from '#queries/update-user-settings.ts';
import { toast } from 'sonner';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '#queries/current-user-query.ts';

export const useUpdateUserSettings = () => {
  const qc = useQueryClient()
  const pathname = usePathname()

  const updateUserSettingsMutation = useMutation({
    mutationFn: async (values: UpdateUserSettings) => updateUserSettings(values),
    onSuccess: async (data) => {
      if (!data || "error" in data) return toast.error("Произошла ошибка", {
        description: "Повторите попытку позже"
      });
      
      qc.setQueryData(CURRENT_USER_QUERY_KEY, (prev: CurrentUser) => ({
        ...prev,
        preferences: { ...prev.preferences, ...data }
      }))

      const nickname = pathname.split("/").pop()

      if (!nickname) return
      
      qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname), (prev: CurrentUser) => ({
        ...prev,
        preferences: { ...prev.preferences, ...data }
      }))
    },
    onError: e => { throw new Error(e.message) }
  })
  
  return { updateUserSettingsMutation }
}