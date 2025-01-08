import { REQUESTED_USER_QUERY_KEY } from '@repo/components/src/profile/components/cover/queries/requested-user-query.ts';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserSettings, updateUserSettings } from '#queries/update-user-settings.ts';
import { toast } from 'sonner';
import { CURRENT_USER_QUERY_KEY } from '#queries/current-user-query.ts';
import type { UserDetailed } from '@repo/types/entities/user-type';

export const useUpdateUserSettings = () => {
  const qc = useQueryClient()
  const pathname = usePathname()

  const updateUserSettingsMutation = useMutation({
    mutationFn: async (values: UpdateUserSettings) => updateUserSettings(values),
    onSuccess: async (data) => {
      if (!data || "error" in data) return toast.error("Произошла ошибка", {
        description: "Повторите попытку позже"
      });
      
      qc.setQueryData(CURRENT_USER_QUERY_KEY, (prev: UserDetailed) => ({
        ...prev,
        preferences: { ...prev.preferences, ...data }
      }))

      const nickname = pathname.split("/").pop()

      if (!nickname) return
      
      qc.setQueryData(CURRENT_USER_QUERY_KEY, (prev: UserDetailed) => ({
        ...prev,
        preferences: { ...prev.preferences, ...data }
      }))

      qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname), (prev: UserDetailed) => ({
        ...prev,
        preferences: { ...prev.preferences, ...data }
      }))
    },
    onError: e => { throw new Error(e.message) }
  })
  
  return { updateUserSettingsMutation }
}