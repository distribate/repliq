import { hasAlertsShow } from "#actions/has-alerts.ts";
import { createQueryKey } from "#helpers/query-key-builder.ts";
import { useReadLocalStorage } from "#hooks/use-read-local-storage.ts";
import { useSuspenseQuery } from "@tanstack/react-query";

export const GLOBAL_PREFERENCES_QUERY_KEY = createQueryKey("ui", ["global-preferences"])

export type GlobalPreferencesQuery = {
  alerts: "show" | "hide",
  autoSaveThreads: boolean
}

export const PREFERENCES_LS_KEY = "preferences";

export const globalPreferencesQuery = () => {
  const value = useReadLocalStorage<Pick<GlobalPreferencesQuery, "autoSaveThreads">>(PREFERENCES_LS_KEY, {
    initializeWithValue: false
  });

  return useSuspenseQuery<GlobalPreferencesQuery>({
    queryKey: GLOBAL_PREFERENCES_QUERY_KEY,
    queryFn: async () => {
      const hasAlertsShowing = hasAlertsShow()

      return {
        alerts: hasAlertsShowing ? "show" : "hide",
        autoSaveThreads: value ? value.autoSaveThreads : false
      }
    },
    refetchOnMount: false
  })
}