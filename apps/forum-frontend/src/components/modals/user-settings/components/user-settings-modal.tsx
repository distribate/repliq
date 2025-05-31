import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@repo/ui/src/components/dialog.tsx";
import { ReactNode } from "react";
import { Typography } from "@repo/ui/src/components/typography";
import { UserLands } from "#components/cards/user-personal-card/components/lands/components/user-lands";
import { UserProfileSettings } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings";
import { UserAdvancedSettings } from "#components/modals/user-settings/components/user-advanced-settings";
import { settingsIsGlobalDialogAtom, settingsSettingsTypeAtom, SettingsType, toggleGlobalDialogAction } from "#components/modals/user-settings/models/user-settings.model";
import { UserPersonalCardHeader } from "#components/modals/user-settings/components/user-header";
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option";
import Campfire from "@repo/assets/images/minecraft/campfire.webp";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp";
import GrassBlock from "@repo/assets/images/minecraft/grass_block.webp";
import FishingRod from "@repo/assets/images/minecraft/fishing_rod.webp";
import { BuyDonateModal } from "../../custom/components/buy-donate-modal";
import Portfolio from "@repo/assets/images/minecraft/portfolio.webp";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp";
import { UserAccountSettingsCard } from "./user-account-settings";
import { Separator } from "@repo/ui/src/components/separator.tsx"
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";

const Main = reatomComponent(({ ctx }) => {
  const handleUpdate = (to: SettingsType) => settingsSettingsTypeAtom(ctx, to)

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">
        Настройки
      </Typography>
      <UserPersonalCardHeader />
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <UserSettingOption
          onClick={() => handleUpdate("profile")} title="Профиль" imageSrc={BookAndQuill}
        />
        <UserSettingOption
          onClick={() => handleUpdate("account")} title="Аккаунт" imageSrc={MinecartWithChest}
        />
        <UserSettingOption
          onClick={() => handleUpdate("other")} title="Прочее" imageSrc={Campfire}
        />
        <Separator />
        <UserSettingOption
          onClick={() => handleUpdate("lands")} title="Мои регионы" imageSrc={GrassBlock}
        />
        <Separator />
        <BuyDonateModal
          trigger={
            <UserSettingOption title="Донат" imageSrc={DragonBreath} />
          }
        />
        <Separator />
        <a href="https://fasberry.su/wiki" rel="noreferrer" target="_blank">
          <DialogClose className="w-full">
            <UserSettingOption title="Вики" imageSrc={Portfolio} />
          </DialogClose>
        </a>
        <CustomLink to="/create-ticket">
          <DialogClose className="w-full">
            <UserSettingOption title="Задать вопрос" imageSrc={FishingRod} />
          </DialogClose>
        </CustomLink>
      </div>
    </div>
  )
}, "Main")

const SETTINGS_SECTIONS: Record<SettingsType, ReactNode> = {
  main: <Main />,
  lands: <UserLands />,
  account: <UserAccountSettingsCard />,
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