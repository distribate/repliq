import { userSettingsAtom, UserSettingsDialog } from "#components/modals/user-settings/queries/user-settings-query"
import { action } from "@reatom/core"

export const updateDialogSectionAction = action((ctx, to: UserSettingsDialog["current"]) => {
  userSettingsAtom(ctx, (state) => ({ ...state, current: to }))
})

export const toggleGlobalDialogAction = action((ctx, { value, reset }: { value: boolean, reset: boolean }) => {
  userSettingsAtom(ctx, (state) => ({ ...state, global: value }))

  if (reset && value === false) {
    setTimeout(() => {
      userSettingsAtom.reset(ctx)
    }, 300)
  }
})