import { atom, batch, Ctx } from "@reatom/core"
import { withReset } from "@reatom/framework"
import { action } from "@reatom/core"
import { log } from "#lib/utils"

export type SettingsType = "main" | "profile" | "account" | "other" 
// | "lands"
export type ProfileDialog = "visibility" | "real-name" | "birthday" | "name-color" | "favorite-item"
export type AccountDialog = "email" | "password" | "sessions" | "black-list" | "delete-account"
type SettingsDialog = AccountDialog | ProfileDialog

// const SETTINGS_TYPE = ["main", "profile", "account", "other", "lands"]
const ACCOUNT_DIALOGS = ["black-list", "email", "password", "sessions", "delete-account"]
const PROFILE_DIALOGS = ["visibility", "real-name", "birthday", "name-color", "favorite-item"]

export const settingsSettingsTypeAtom = atom<SettingsType>("main", "settingsSettingsType").pipe(withReset())
export const settingsCurrentDialogAtom = atom<SettingsDialog | null>(null, "settingsCurrentDialog").pipe(withReset())
export const settingsIsGlobalDialogAtom = atom(false, "settingsIsGlobalDialog").pipe(withReset())

settingsSettingsTypeAtom.onChange((_, state) => log("settingsSettingsTypeAtom", state))
settingsCurrentDialogAtom.onChange((_, state) => log("settingsCurrentDialogAtom", state))
settingsIsGlobalDialogAtom.onChange((_, state) => log("settingsIsGlobalDialogAtom", state))

export const navigateToDialogAction = action((ctx, to: SettingsDialog | SettingsType) => {
  log("navigateToDialogAction", to)

  const toUpdated = to as SettingsDialog

  if (ACCOUNT_DIALOGS.includes(toUpdated)) {
    settingsSettingsTypeAtom(ctx, "account")
    settingsCurrentDialogAtom(ctx, toUpdated)
  } else if (PROFILE_DIALOGS.includes(toUpdated)) {
    settingsSettingsTypeAtom(ctx, "profile")
    settingsCurrentDialogAtom(ctx, toUpdated)
  }
}, "navigateToDialogAction")

export const navigateToBackAction = action((ctx) => {
  const current = ctx.get(settingsCurrentDialogAtom)

  if (current) {
    if (ACCOUNT_DIALOGS.includes(current)) {
      settingsCurrentDialogAtom.reset(ctx)
      settingsSettingsTypeAtom(ctx, "account")
    } else if (PROFILE_DIALOGS.includes(current)) {
      settingsCurrentDialogAtom.reset(ctx)
      settingsSettingsTypeAtom(ctx, "profile")
    }
  } else {
    batch(ctx, () => {
      settingsSettingsTypeAtom.reset(ctx)
      settingsCurrentDialogAtom.reset(ctx)
      settingsIsGlobalDialogAtom(ctx, true)
    })
  }
}, "navigateToBackAction")

export const toggleGlobalDialogAction = action((ctx, { value, reset }: { value: boolean, reset: boolean }) => {
  settingsIsGlobalDialogAtom(ctx, value)

  if (reset && value === false) {
    setTimeout(() => settingsReset(ctx), 300)
  }
}, "toggleGlobalDialogAction")

function settingsReset(ctx: Ctx) {
  batch(ctx, () => {
    settingsIsGlobalDialogAtom.reset(ctx)
    settingsSettingsTypeAtom.reset(ctx)
    settingsCurrentDialogAtom.reset(ctx)
  })
}