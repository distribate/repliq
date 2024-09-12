import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp"
import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  UserSettingsCard
} from '../../cards/components/user-personal-card/components/account-settings/user-settings-card.tsx';

export const ACCOUNT_SETTINGS_MODAL_NAME = "account-settings"

export const AccountSettingsModal = () => {
  console.log('account-settings render')
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