import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import Portfolio from "@repo/assets/images/minecraft/portfolio.webp";
import { TicketsModal } from "#modals/custom/tickets-modal.tsx";
import {
  UserProfileSettings,
  UserSettingOption,
} from "./components/profile-settings/user-profile-settings.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { UserSettingsCard } from "#cards/components/user-personal-card/components/account-settings/user-settings-card.tsx";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp";
import { UserAdvancedSettings } from "#cards/components/user-personal-card/components/advanced-settings/user-advanced-settings.tsx";
import Campfire from "@repo/assets/images/minecraft/campfire.webp";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp";
import GrassBlock from "@repo/assets/images/minecraft/grass_block.webp";
import FishingRod from "@repo/assets/images/minecraft/fishing_rod.webp";
import Link from "next/link";
import { userStatusQuery } from "@repo/lib/queries/user-status-query.ts";

const UserPersonalCardHeader = () => {
  const { nickname, name_color } = getUser();
  const { data: userStatus } = userStatusQuery(nickname);

  const isOnline = userStatus?.status;

  return (
    <>
      <Avatar propHeight={96} propWidth={96} nickname={nickname} />
      <div className="flex flex-col items-center">
        <UserNickname
          nickname={nickname}
          nicknameColor={name_color}
          className="text-base font-bold"
        />
        <Typography>
          {isOnline ? "в сети" : "не в сети"}
        </Typography>
      </div>
    </>
  );
};

export const UserPersonalCard = () => {
  return (
    <div className="flex flex-col gap-y-4 pt-4 items-center w-full">
      <UserPersonalCardHeader />
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Профиль" imageSrc={BookAndQuill.src} />
          </DialogTrigger>
          <DialogContent>
            <UserProfileSettings />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Аккаунт" imageSrc={MinecartWithChest.src} />
          </DialogTrigger>
          <DialogContent>
            <UserSettingsCard />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Прочее" imageSrc={Campfire.src} />
          </DialogTrigger>
          <DialogContent>
            <UserAdvancedSettings />
          </DialogContent>
        </Dialog>
        <Separator />
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Мои регионы" imageSrc={GrassBlock.src} />
          </DialogTrigger>
          <DialogContent>

          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <UserSettingOption title="Рейтинг" imageSrc={DragonBreath.src} />
          </DialogTrigger>
          <DialogContent>

          </DialogContent>
        </Dialog>
        <Separator />
        <Link href="https://fasberry.su/wiki" target="_blank">
          <UserSettingOption title="Вики" imageSrc={Portfolio.src} />
        </Link>
        <TicketsModal
          trigger={
            <UserSettingOption title="Задать вопрос" imageSrc={FishingRod.src} />
          }
        />
      </div>
    </div>
  );
};