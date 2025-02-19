import { GLOBAL_PREFERENCES_QUERY_KEY, globalPreferencesQuery, GlobalPreferencesQuery, PREFERENCES_LS_KEY } from "#queries/global-preferences-query.ts";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";
import { getCookieByKey } from "#helpers/get-cookie-by-key.ts";
import { ALERTS_COOKIE_KEY, INTRO_COOKIE_KEY } from "@repo/shared/keys/cookie";
import { toast } from "sonner";

type KeyType = "intro" | "alerts"

const visibilityMap: Record<KeyType, string> = {
  "intro": INTRO_COOKIE_KEY,
  "alerts": ALERTS_COOKIE_KEY
}

export function updateVisibility(k: keyof typeof visibilityMap) {
  const has = getCookieByKey(visibilityMap[k]);

  if (has && has !== "show") {
    document.cookie = `${visibilityMap[k]}=show`;
    return "show"
  }

  document.cookie = `${visibilityMap[k]}=hide`;

  return "hide"
}

const visibilityMessages: Record<KeyType, {
  msg: Record<"show" | "hide", {
    title: string,
    description: string
  }>
}> = {
  "intro": {
    msg: {
      "show": {
        title: "Интро снова отображается.",
        description: "Вы можете его скрыть в настройках."
      },
      "hide": {
        title: "Интро скрыто.",
        description: "Вы можете снова включить его в настройках."
      }
    }
  },
  "alerts": {
    msg: {
      "show": {
        title: "Объявления снова отображаются.",
        description: "Вы можете их скрыть в настройках."
      },
      "hide": {
        title: "Объявления скрыты.",
        description: "Вы можете их включить в настройках."
      }
    }
  }
}

export const useUpdateGlobalPreferences = () => {
  const qc = useQueryClient()
  const { data: globalPreferences } = globalPreferencesQuery()

  const [value, setValue] = useLocalStorage<Pick<GlobalPreferencesQuery, "autoSaveThreads">>(
    PREFERENCES_LS_KEY,
    { autoSaveThreads: true }
  );

  const updateShowingMutation = useMutation({
    mutationFn: async (key: KeyType) => updateVisibility(key),
    onSuccess: async (data, variables) => {
      switch (variables) {
        case "alerts":
          qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY,
            (prev: GlobalPreferencesQuery) => ({ ...prev, alerts: data })
          )

          switch (data) {
            case "hide":
              toast.info(visibilityMessages.alerts.msg.hide.title, {
                description: visibilityMessages.alerts.msg.hide.description,
              });
              break;
            case "show":
              toast.info(visibilityMessages.alerts.msg.show.title, {
                description: visibilityMessages.alerts.msg.show.description,
              });
              break;
          }
        case "intro":
          qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY,
            (prev: GlobalPreferencesQuery) => ({ ...prev, intro: data })
          )

          switch (data) {
            case "hide":
              toast.info(visibilityMessages.intro.msg.hide.title, {
                description: visibilityMessages.intro.msg.hide.description,
              });
              break;
            case "show":
              toast.info(visibilityMessages.intro.msg.show.title, {
                description: visibilityMessages.intro.msg.show.description,
              });
              break;
            default:
              break;
          }
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
    onSuccess: async () => {
      qc.setQueryData(GLOBAL_PREFERENCES_QUERY_KEY, (prev: GlobalPreferencesQuery) => ({
        ...prev, autoSaveThreads: value.autoSaveThreads
      }))
    },
    onError: e => { throw new Error(e.message) }
  })

  return { updateThreadsSavingMutation, updateShowingMutation }
}