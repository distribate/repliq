import { action } from '@reatom/core';
import { reatomAsync, withStatusesAtom } from '@reatom/async';
import { toast } from "sonner";
import { atom } from '@reatom/core';
import { withCookie } from "@reatom/persist-web-storage"

type KeyType = "intro" | "alerts"

type VisibilityKey = "show" | "hide"

type GlobalPreferences = {
  alerts: VisibilityKey,
  autoSaveThreads: boolean,
  intro: VisibilityKey
}

const initial: GlobalPreferences = {
  alerts: "show",
  intro: "show", 
  autoSaveThreads: true
}

const GLOBAL_PREFERENCES_KEY = "preferences"

export const globalPreferencesAtom = atom<GlobalPreferences>(initial, "globalPreferences").pipe(
  withCookie({ maxAge: 999999999 })(GLOBAL_PREFERENCES_KEY)
)

const VISIBILITY_MESSAGES: Record<KeyType, {
  msg: Record<VisibilityKey, {
    title: string,
    description: string
  }>
}> = {
  "intro": {
    msg: {
      "show": {
        title: "Интро снова отображается",
        description: "Вы можете его скрыть в настройках"
      },
      "hide": {
        title: "Интро скрыто",
        description: "Вы можете снова включить его в настройках"
      }
    }
  },
  "alerts": {
    msg: {
      "show": {
        title: "Объявления снова отображаются",
        description: "Вы можете их скрыть в настройках"
      },
      "hide": {
        title: "Объявления скрыты",
        description: "Вы можете их включить в настройках"
      }
    }
  }
}

export const updateVisibilityAction = reatomAsync(async (ctx, key: KeyType) => {
  const target = ctx.get(globalPreferencesAtom)[key]
  
  return {
    result: target === 'hide' ? 'show' : 'hide' as VisibilityKey,
    key
  }
}, {
  name: "updateVisibilityAction",
  onFulfill: async (ctx, { result, key }) => {
    switch (key) {
      case "alerts":
        globalPreferencesAtom(ctx, (state) => ({ ...state, alerts: result }))

        switch (result) {
          case "hide":
            toast.info(VISIBILITY_MESSAGES.alerts.msg.hide.title, {
              description: VISIBILITY_MESSAGES.alerts.msg.hide.description,
            });
            break;
          case "show":
            toast.info(VISIBILITY_MESSAGES.alerts.msg.show.title, {
              description: VISIBILITY_MESSAGES.alerts.msg.show.description,
            });
            break;
        }
        break;

      case "intro":
        globalPreferencesAtom(ctx, (state) => ({ ...state, intro: result }))

        switch (result) {
          case "hide":
            toast.info(VISIBILITY_MESSAGES.intro.msg.hide.title, {
              description: VISIBILITY_MESSAGES.intro.msg.hide.description,
            });
            break;
          case "show":
            toast.info(VISIBILITY_MESSAGES.intro.msg.show.title, {
              description: VISIBILITY_MESSAGES.intro.msg.show.description,
            });
            break;
          default:
            break;
        }
    }
  }
}).pipe(withStatusesAtom())

export const updateHistoryThreadsOptionAction = action(async (ctx) => {
  globalPreferencesAtom(ctx, (state) => ({ ...state, autoSaveThreads: !state.autoSaveThreads }))
}, "updateHistoryThreadsOptionAction")