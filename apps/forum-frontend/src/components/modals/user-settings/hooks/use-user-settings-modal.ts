import { USER_SETTINGS_QUERY_KEY, UserSettingsQuery } from "#components/modals/user-settings/queries/user-settings-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUserSettingsModal = () => {
  const qc = useQueryClient()

  const updateDialogSectionMutation = useMutation({
    mutationFn: async ({ to }: { to: UserSettingsQuery["current"] }) => {
      return qc.setQueryData(USER_SETTINGS_QUERY_KEY, 
        (prev: UserSettingsQuery) => ({ ...prev, current: to })
      )
    },
    onError: e => { throw new Error(e.message) }
  })

  const toggleGlobalDialogMutation = useMutation({
    mutationFn: async ({ value, reset }: { value: boolean, reset: boolean }) => {
      qc.setQueryData(USER_SETTINGS_QUERY_KEY, 
        (prev: UserSettingsQuery) => ({ ...prev, global: value })
      )

      if (reset && value === false) {
        setTimeout(() => {
          qc.resetQueries({ queryKey: USER_SETTINGS_QUERY_KEY })
        }, 300)
      }
    },
    onError: e => { throw new Error(e.message) }
  })

  return { updateDialogSectionMutation, toggleGlobalDialogMutation }
}