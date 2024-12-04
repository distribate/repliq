import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/components/nickname.tsx";
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
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import { UserSettingsCard } from "#cards/components/user-personal-card/components/account-settings/user-settings-card.tsx";
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp";
import { UserAdvancedSettings } from "#cards/components/user-personal-card/components/advanced-settings/user-advanced-settings.tsx";
import Campfire from "@repo/assets/images/minecraft/campfire.webp";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";

const UserPersonalCardHeader = () => {
  const currentUser = getUser();

  const { nickname, name_color } = currentUser;

  return (
    <>
      <Avatar propHeight={96} propWidth={96} nickname={nickname} />
      <div className="flex flex-col items-center">
        <UserNickname
          nickname={nickname}
          nicknameColor={name_color}
          className="text-base font-bold"
        />
        <Typography>онлайн</Typography>
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
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center w-full">
                <ImageWrapper
                  propSrc={BookAndQuill?.src}
                  width={26}
                  height={26}
                  loading="eager"
                  propAlt="Change description"
                />
                <Typography className="text-base">Профиль</Typography>
              </div>
            </HoverCardItem>
          </DialogTrigger>
          <DialogContent>
            <UserProfileSettings />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center w-full">
                <ImageWrapper
                  propSrc={MinecartWithChest?.src}
                  width={26}
                  height={26}
                  loading="eager"
                  propAlt="Change description"
                />
                <Typography className="text-base">Аккаунт</Typography>
              </div>
            </HoverCardItem>
          </DialogTrigger>
          <DialogContent>
            <UserSettingsCard />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center w-full">
                <ImageWrapper
                  propSrc={Campfire?.src}
                  width={26}
                  height={26}
                  loading="eager"
                  propAlt="Change description"
                />
                <Typography className="text-base">Прочее</Typography>
              </div>
            </HoverCardItem>
          </DialogTrigger>
          <DialogContent>
            <UserAdvancedSettings />
          </DialogContent>
        </Dialog>
        <Separator />
        <TicketsModal
          trigger={
            <UserSettingOption title="Задать вопрос" imageSrc={Portfolio.src} />
          }
        />
      </div>
    </div>
  );
};
