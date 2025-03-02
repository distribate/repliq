import { Separator } from "@repo/ui/src/components/separator.tsx";
import Portfolio from "@repo/assets/images/minecraft/portfolio.webp";
import {
  UserProfileSettings,
  UserSettingOption,
} from "./components/profile-settings/user-profile-settings.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { UserSettingsCard } from "#components/cards/user-personal-card/components/account-settings/user-settings-card.tsx";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp";
import { UserAdvancedSettings } from "#components/cards/user-personal-card/components/advanced-settings/user-advanced-settings.tsx";
import { Link } from "@tanstack/react-router";
import { BuyDonateModal } from "#components/modals/custom/buy-donate-modal.tsx";
import { UserLands } from "./components/lands/user-lands.tsx";
import { UserPersonalCardHeader } from "./components/header/user-header.tsx";

import Campfire from "@repo/assets/images/minecraft/campfire.webp";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp";
import GrassBlock from "@repo/assets/images/minecraft/grass_block.webp";
import FishingRod from "@repo/assets/images/minecraft/fishing_rod.webp";

export const UserPersonalCard = () => {
  return (
    <div className="flex flex-col gap-y-4 pt-4 items-center w-full">
      <UserPersonalCardHeader />
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <Dialog key="profile">
          <DialogTrigger>
            <UserSettingOption title="Профиль" imageSrc={BookAndQuill} />
          </DialogTrigger>
          <DialogContent>
            <UserProfileSettings />
          </DialogContent>
        </Dialog>
        <Dialog key="account">
          <DialogTrigger>
            <UserSettingOption title="Аккаунт" imageSrc={MinecartWithChest} />
          </DialogTrigger>
          <DialogContent>
            <UserSettingsCard />
          </DialogContent>
        </Dialog>
        <Dialog key="other">
          <DialogTrigger>
            <UserSettingOption title="Прочее" imageSrc={Campfire} />
          </DialogTrigger>
          <DialogContent>
            <UserAdvancedSettings />
          </DialogContent>
        </Dialog>
        <Separator />
        <Dialog key="regions">
          <DialogTrigger>
            <UserSettingOption title="Мои регионы" imageSrc={GrassBlock} />
          </DialogTrigger>
          <DialogContent>
            <UserLands />
          </DialogContent>
        </Dialog>
        <Separator />
        <BuyDonateModal trigger={<UserSettingOption title="Донат" imageSrc={DragonBreath} />} />
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
  );
};