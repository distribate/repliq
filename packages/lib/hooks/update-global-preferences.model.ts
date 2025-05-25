import { action, atom } from '@reatom/core';
import { reatomAsync, withStatusesAtom } from '@reatom/async';
import { globalPreferencesAtom } from "#queries/global-preferences-query.ts";
import { toast } from "sonner";

type KeyType = "intro" | "alerts"

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

const updateVisibilityVariablesAtom = atom<KeyType | null>(null, "updateVisibilityVariables")

export const updateVisibilityAction = reatomAsync(async (ctx, key: KeyType) => {
  updateVisibilityVariablesAtom(ctx, key)
  const target = ctx.get(globalPreferencesAtom)[key]

  return target === 'hide' ? 'show' : 'hide'
}, {
  name: "updateVisibilityAction",
  onFulfill: async (ctx, res) => {
    const variable = ctx.get(updateVisibilityVariablesAtom)
    if (!variable) return;

    switch (variable) {
      case "alerts":
        globalPreferencesAtom(ctx, (state) => ({ ...state, alerts: res }))

        switch (res) {
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
        break;

      case "intro":
        globalPreferencesAtom(ctx, (state) => ({ ...state, intro: res }))

        switch (res) {
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
  }
}).pipe(withStatusesAtom())

export const updateThreadsSettingAction = action(async (ctx) => {
  globalPreferencesAtom(ctx, (state) => ({ ...state, autoSaveThreads: !state.autoSaveThreads }))
}, "updateThreadsSettingAction")