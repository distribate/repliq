import { atom } from "@reatom/core"
import { withReset } from "@reatom/framework"

export type UserSettingsDialog = {
  current: "main" | "profile" | "account" | "other" | "lands",
  global: boolean
}

const initial: UserSettingsDialog = {
  current: "main",
  global: false
}

export const userSettingsAtom = atom<UserSettingsDialog>(initial, "userSettings").pipe(withReset())