import { setAlerts } from "#actions/set-alerts.ts";
import { GLOBAL_PREFERENCES_QUERY_KEY, globalPreferencesQuery, GlobalPreferencesQuery, PREFERENCES_LS_KEY } from "#queries/global-preferences-query.ts";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

export const useUpdateGlobalPreferences = () => {
  const qc = useQueryClient()
  const { data: globalPreferences } = globalPreferencesQuery()

  const [value, setValue] = useLocalStorage<Pick<GlobalPreferencesQuery, "autoSaveThreads">>(PREFERENCES_LS_KEY, {
    autoSaveThreads: true,
  });

  const updateAlertsShowingMutation = useMutation({
    mutationFn: async () => setAlerts(),
    onSuccess: async (data) => {
      qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY, (prev: GlobalPreferencesQuery) => ({
        ...prev,
        alerts: data
      }))
    },
    onError: e => { throw new Error(e.message) }
  })

  const updateThreadsSavingMutation = useMutation({
    mutationFn: async () => {
      const { autoSaveThreads } = globalPreferences

      return setValue({
        ...value,
        autoSaveThreads: !autoSaveThreads,
      });
    },
    onSuccess: async (data) => {
      qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY, (prev: GlobalPreferencesQuery) => ({
        ...prev,
        autoSaveThreads: value.autoSaveThreads
      }))
    },
    onError: e => { throw new Error(e.message) }
  })

  return { updateAlertsShowingMutation, updateThreadsSavingMutation }
}