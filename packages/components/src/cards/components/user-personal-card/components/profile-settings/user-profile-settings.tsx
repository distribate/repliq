import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import { DescriptionInput } from "./components/description-input.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { OutlineCover } from "./components/outline-cover.tsx";
import Lead from "@repo/assets/images/minecraft/lead.webp";
import { RealNameChangeModal } from "#modals/user-settings/real-name-change-modal.tsx";
import { NicknameColorPickerModal } from "#modals/user-settings/nickname-color-picker-modal.tsx";
import { FavoriteItemModal } from "#modals/user-settings/favorite-item-modal.tsx";
import { ReactNode } from "react";
import { ProfileVisibilityChange } from "./components/visibility-profile/components/profile-visibility-change.tsx";
import { DateBirthdayModal } from "#modals/user-settings/date-birthday-modal.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";

type ProfileSetting = {
  title: string;
  imageSrc?: string;
  children?: ReactNode;
};

export const UserSettingOption = ({
  title, children, imageSrc,
}: ProfileSetting) => {
  return (
    <HoverCardItem className="justify-between w-full">
      <div className="flex gap-x-2 items-center w-full">
        {imageSrc && (
          <ImageWrapper
            propSrc={imageSrc}
            propAlt={title}
            width={32}
            className="max-w-[40px] max-h-[40px]"
            height={32}
          />
        )}
        <Typography className="text-base">{title}</Typography>
      </div>
      <div className="min-w-fit">{children || " "}</div>
    </HoverCardItem>
  );
};

export const UserProfileSettings = () => {
  const { donate } = getUser();

  const isAccess = donate !== "default";

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Профиль</Typography>
      <div className="flex flex-col w-full gap-y-4">
        <DescriptionInput />
        <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
          <Typography className="text-base text-shark-200">
            Расскажи о своем возрасте или чем занимаешься?
          </Typography>
          <Typography className="text-base text-shark-200">
            Например: 20-ти летний майнкрафтер из Москвы
          </Typography>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <ProfileVisibilityChange />
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <DateBirthdayModal />
        <RealNameChangeModal />
        {isAccess && (
          <>
            <Separator className="relative bg-authentic-background brightness-150 mb-2">
              <Typography className="absolute z-2 -top-0 left-0 text-authentic-background font-[Minecraft] text-[14px]">
                only Authentic+
              </Typography>
            </Separator>
            <NicknameColorPickerModal />
            <UserSettingOption
              title="Обводка вокруг шапки профиля"
              imageSrc={Lead.src}
            >
              <OutlineCover />
            </UserSettingOption>
            <FavoriteItemModal />
          </>
        )}
      </div>
    </div>
  );
};
