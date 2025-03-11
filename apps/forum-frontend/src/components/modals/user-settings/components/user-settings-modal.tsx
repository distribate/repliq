import {
  DialogClose,
  DialogContent,
} from "@repo/ui/src/components/dialog.tsx";
import { ReactNode } from "react";
import { Typography } from "@repo/ui/src/components/typography";
import { UserLands } from "#components/cards/user-personal-card/components/lands/user-lands";
import { UserProfileSettings } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings";
import { UserAdvancedSettings } from "#components/modals/user-settings/components/user-advanced-settings";
import { userSettingsQuery, UserSettingsQuery } from "#components/modals/user-settings/queries/user-settings-query";
import { useUserSettingsModal } from "../hooks/use-user-settings-modal";
import { UserPersonalCardHeader } from "#components/modals/user-settings/components/user-header";
import { Link } from "@tanstack/react-router";
import { UserSettingOption } from "#components/cards/user-setting-option";
import Campfire from "@repo/assets/images/minecraft/campfire.webp";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp";
import GrassBlock from "@repo/assets/images/minecraft/grass_block.webp";
import FishingRod from "@repo/assets/images/minecraft/fishing_rod.webp";
import { BuyDonateModal } from "../../custom/buy-donate-modal";
import Portfolio from "@repo/assets/images/minecraft/portfolio.webp";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp";
import { UserAccountSettingsCard } from "./user-account-settings";
import { Separator } from "@repo/ui/src/components/separator.tsx"

const Main = () => {
  const { updateDialogSectionMutation } = useUserSettingsModal()

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">
        Настройки
      </Typography>
      <UserPersonalCardHeader />
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <UserSettingOption
          onClick={() => updateDialogSectionMutation.mutate({ to: "profile" })}
          title="Профиль"
          imageSrc={BookAndQuill}
        />
        <UserSettingOption
          onClick={() => updateDialogSectionMutation.mutate({ to: "account" })}
          title="Аккаунт"
          imageSrc={MinecartWithChest}
        />
        <UserSettingOption
          onClick={() => updateDialogSectionMutation.mutate({ to: "other" })}
          title="Прочее"
          imageSrc={Campfire}
        />
        <Separator />
        <UserSettingOption
          onClick={() => updateDialogSectionMutation.mutate({ to: "lands" })}
          title="Мои регионы"
          imageSrc={GrassBlock}
        />
        <Separator />
        <BuyDonateModal
          trigger={
            <UserSettingOption title="Донат" imageSrc={DragonBreath} />
          }
        />
        <Separator />
        <a href="https://fasberry.su/wiki" target="_blank">
          <DialogClose className="w-full">
            <UserSettingOption title="Вики" imageSrc={Portfolio} />
          </DialogClose>
        </a>
        <Link to="/create-ticket">
          <DialogClose className="w-full">
            <UserSettingOption title="Задать вопрос" imageSrc={FishingRod} />
          </DialogClose>
        </Link>
      </div>
    </div>
  )
}

const SETTINGS_SECTIONS: Record<UserSettingsQuery["current"], ReactNode> = {
  "main": <Main />,
  "lands": <UserLands />,
  "account": <UserAccountSettingsCard />,
  "profile": <UserProfileSettings />,
  "other": <UserAdvancedSettings />
}

export const UserSettingsModal = () => {
  const { current } = userSettingsQuery().data
  
  const handleEscKeyDown = (e: KeyboardEvent) => {
    if (current !== 'main') {
      e.preventDefault()
    }
  }

  return (
    <>
      <DialogContent onEscapeKeyDown={handleEscKeyDown}>
        {SETTINGS_SECTIONS[current]}
      </DialogContent>
    </>
  );
};