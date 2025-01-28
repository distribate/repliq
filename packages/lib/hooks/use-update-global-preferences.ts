import { updateAlertsVisibility } from "#actions/update-alerts-visibility.ts";
import { GLOBAL_PREFERENCES_QUERY_KEY, globalPreferencesQuery, GlobalPreferencesQuery, PREFERENCES_LS_KEY } from "#queries/global-preferences-query.ts";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";
import { getCookieByKey } from "#helpers/get-cookie-by-key.ts";
import { INTRO_COOKIE_KEY } from "@repo/shared/keys/cookie";
import { toast } from "sonner";

export async function updateIntroVisibility() {
  const hasIntroShowing = getCookieByKey(INTRO_COOKIE_KEY);

  if (hasIntroShowing && hasIntroShowing !== "show") {
    document.cookie = `${INTRO_COOKIE_KEY}=show`;
    return "show"
  }

  document.cookie = `${INTRO_COOKIE_KEY}=hide`;

  return "hide"
}

export const useUpdateGlobalPreferences = () => {
  const qc = useQueryClient()
  const { data: globalPreferences } = globalPreferencesQuery()

  const [value, setValue] = useLocalStorage<Pick<GlobalPreferencesQuery, "autoSaveThreads">>(PREFERENCES_LS_KEY, {
    autoSaveThreads: true,
  });

  const updateAlertsShowingMutation = useMutation({
    mutationFn: async () => updateAlertsVisibility(),
    onSuccess: async (data) => {
      qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY, (prev: GlobalPreferencesQuery) => ({
        ...prev,
        alerts: data
      }))

      if (data === 'hide') {
        toast.info("Объявления скрыты.", {
          description: "Вы можете их включить в настройках.",
        });
      } else {
        toast.info("Объявления снова отображаются.", {
          description: "Вы можете их скрыть в настройках.",
        });
      }
    },
    onError: e => { throw new Error(e.message) }
  })

  const updateIntroVisibilityMutation = useMutation({
    mutationFn: async () => updateIntroVisibility(),
    onSuccess: async (data) => {
      qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY, (prev: GlobalPreferencesQuery) => ({
        ...prev,
        intro: data
      }))

      if (data === 'hide') {
        toast.info("Интро скрыто.", {
          description: "Вы можете снова включить его в настройках.",
        });
      } else {
        toast.info("Интро снова отображается.", {
          description: "Вы можете его скрыть в настройках.",
        });
      }
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

  return { updateAlertsShowingMutation, updateThreadsSavingMutation, updateIntroVisibilityMutation }
}