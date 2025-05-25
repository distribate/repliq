import { atom } from '@reatom/core';
import { withCookie } from "@reatom/persist-web-storage"

type GlobalPreferences = {
  alerts: "show" | "hide",
  autoSaveThreads: boolean,
  intro: "show" | "hide"
}

const initial: GlobalPreferences = {
  alerts: "show",
  intro: "show", 
  autoSaveThreads: true
}

export const globalPreferencesAtom = atom<GlobalPreferences>(initial, "globalPreferences").pipe(
  withCookie({ maxAge: 999999999 })("preferences")
)