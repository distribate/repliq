import { Dialog, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { ReactNode } from "react";
import { UserAdvancedSettings } from "#components/user/settings/advanced/components/user-advanced-settings";
import { 
  settingsIsGlobalDialogAtom, 
  settingsSettingsTypeAtom, 
  SettingsType, 
  toggleGlobalDialogAction 
} from "#components/modals/user-settings/models/user-settings.model";
import { UserAccountSettings } from "../../../user/settings/account/components/user-account-settings";
import { reatomComponent } from "@reatom/npm-react";
import { UserProfileSettings } from "#components/user/settings/profile/components/user-profile-settings";
import { UserMainSettings } from "#components/user/settings/main/components/user-main-settings";

const SETTINGS_SECTIONS: Record<SettingsType, ReactNode> = {
  main: <UserMainSettings />,
  account: <UserAccountSettings />,
  profile: <UserProfileSettings />,
  other: <UserAdvancedSettings />
}

export const UserSettingsModal = reatomComponent(({ ctx }) => {
  const current = ctx.spy(settingsSettingsTypeAtom)
  const global = ctx.spy(settingsIsGlobalDialogAtom)

  const handleEscKeyDown = (e: KeyboardEvent) => {
    if (current !== 'main') {
      e.preventDefault()
    }
  }

  return (
    <Dialog open={global} onOpenChange={value => toggleGlobalDialogAction(ctx, { reset: true, value })}>
      <DialogContent onEscapeKeyDown={handleEscKeyDown}>
        {SETTINGS_SECTIONS[current]}
      </DialogContent>
    </Dialog>
  );
}, "UserSettingsModal")