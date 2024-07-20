import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { ImageWrapper } from '../wrappers/image-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  UserSettingsCard
} from '../cards/components/user-personal-card/components/account-settings/user-settings-card.tsx';
import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp"

export const ACCOUNT_SETTINGS_MODAL_NAME = "account-settings"

export const AccountSettingsModal = () => {
  return (
    <DialogWrapper
      key={ACCOUNT_SETTINGS_MODAL_NAME}
      name={ACCOUNT_SETTINGS_MODAL_NAME}
      trigger={
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
      }
    >
      <UserSettingsCard/>
    </DialogWrapper>
  )
}