import { atom, batch, Ctx } from "@reatom/core"
import { withReset } from "@reatom/framework"
import { action } from "@reatom/core"
import { log } from "#shared/utils/log"
import { resetUploadedChanges } from "#components/user/components/avatar/models/avatar.model"

export type ProfileDialog = "visibility" | "real-name" | "birthday" | "name-color"
export type AccountDialog = "email" | "password" | "sessions" | "black-list" | "delete-account"
export type SettingsDialog = "main" | "profile" | "account" | "other"

type SettingsType = AccountDialog | ProfileDialog | SettingsDialog

const PROFILE_DIALOGS: readonly ProfileDialog[] = ["visibility", "real-name", "birthday", "name-color"]
const ACCOUNT_DIALOGS: readonly AccountDialog[] = ["black-list", "email", "password", "sessions", "delete-account"]
const SETTINGS_DIALOGS: readonly SettingsDialog[] = ["main", "profile", "account", "other"]

export const settingsSettingsTypeAtom = atom<SettingsType>("main", "settingsSettingsType").pipe(withReset())
export const settingsCurrentDialogAtom = atom<SettingsDialog | null>(null, "settingsCurrentDialog").pipe(withReset())
export const settingsIsGlobalDialogAtom = atom(false, "settingsIsGlobalDialog").pipe(withReset())

export const navigateToDialogAction = action((ctx, to: SettingsType) => {
  log("navigateToDialogAction", to)

  if (ACCOUNT_DIALOGS.includes(to as AccountDialog)) {
    settingsSettingsTypeAtom(ctx, "account");
    settingsCurrentDialogAtom(ctx, to as SettingsDialog);
    return
  }

  if (PROFILE_DIALOGS.includes(to as ProfileDialog)) {
    settingsSettingsTypeAtom(ctx, "profile");
    settingsCurrentDialogAtom(ctx, to as SettingsDialog);
    return
  }

  if (SETTINGS_DIALOGS.includes(to as SettingsDialog)) {
    settingsSettingsTypeAtom(ctx, to as SettingsDialog);
    settingsCurrentDialogAtom(ctx, null);
    return
  }
}, "navigateToDialogAction")

export const navigateToBackAction = action((ctx) => {
  const current = ctx.get(settingsCurrentDialogAtom)

  if (current) {
    if (ACCOUNT_DIALOGS.includes(current as AccountDialog)) {
      settingsCurrentDialogAtom.reset(ctx);
      settingsSettingsTypeAtom(ctx, "account");
      return
    }

    if (PROFILE_DIALOGS.includes(current as ProfileDialog)) {
      settingsCurrentDialogAtom.reset(ctx);
      settingsSettingsTypeAtom(ctx, "profile");
      return
    }
  }

  batch(ctx, () => {
    settingsSettingsTypeAtom.reset(ctx);
    settingsCurrentDialogAtom.reset(ctx);
    settingsIsGlobalDialogAtom(ctx, true);
  });
}, "navigateToBackAction")

const customEventsOnCloseDialog = action((ctx) => {
  log("customEventsOnCloseDialog", "execute")

  batch(ctx, () => {
    resetUploadedChanges(ctx)
  })
}, "customEventsOnCloseDialog")

settingsIsGlobalDialogAtom.onChange((ctx, state) => {
  if (!state) {
    customEventsOnCloseDialog(ctx)
  }
})

export const toggleGlobalDialogAction = action((ctx, { value, reset }: { value: boolean, reset: boolean }) => {
  settingsIsGlobalDialogAtom(ctx, value)

  if (!value && reset) {
    setTimeout(() => settingsReset(ctx), 300)
  }
}, "toggleGlobalDialogAction")

function settingsReset(ctx: Ctx) {
  batch(ctx, () => {
    settingsSettingsTypeAtom.reset(ctx)
    settingsCurrentDialogAtom.reset(ctx)
    settingsIsGlobalDialogAtom.reset(ctx)
  })
}

settingsSettingsTypeAtom.onChange((_, state) => log("settingsSettingsTypeAtom", state))
settingsCurrentDialogAtom.onChange((_, state) => log("settingsCurrentDialogAtom", state))
settingsIsGlobalDialogAtom.onChange((_, state) => log("settingsIsGlobalDialogAtom", state))