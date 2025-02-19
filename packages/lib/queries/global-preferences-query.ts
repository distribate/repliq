import { getCookieByKey } from "#helpers/get-cookie-by-key.ts";
import { createQueryKey } from "#helpers/query-key-builder.ts";
import { useReadLocalStorage } from "#hooks/use-read-local-storage.ts";
import { ALERTS_COOKIE_KEY, INTRO_COOKIE_KEY } from "@repo/shared/keys/cookie";
import { useSuspenseQuery } from "@tanstack/react-query";

export const GLOBAL_PREFERENCES_QUERY_KEY = createQueryKey("ui", ["global-preferences"])

export type GlobalPreferencesQuery = {
  alerts: "show" | "hide",
  autoSaveThreads: boolean,
  intro: "show" | "hide"
}

function hasIntroShow(): boolean {
  const hasIntroShowing = getCookieByKey(INTRO_COOKIE_KEY);

  if (hasIntroShowing === "show") return true;

  return hasIntroShowing !== "hide";
}

function hasAlertsShow(): boolean {
  const hasAlertsShowing = getCookieByKey(ALERTS_COOKIE_KEY);

  if (hasAlertsShowing === "show") return true;

  return hasAlertsShowing !== "hide";
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
      const hasIntroShowing = hasIntroShow()

      return {
        alerts: hasAlertsShowing ? "show" : "hide",
        intro: hasIntroShowing ? "show" : "hide",
        autoSaveThreads: value ? value.autoSaveThreads : false
      }
    },
    refetchOnMount: false
  })
}