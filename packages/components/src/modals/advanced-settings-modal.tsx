import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { ImageWrapper } from '../wrappers/image-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  UserAdvancedSettings
} from '../cards/components/user-personal-card/components/advanced-settings/user-advanced-settings.tsx';
import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import Campfire from "@repo/assets/images/minecraft/campfire.webp"

export const ADVANCED_SETTINGS_MODAL_NAME = "advanced-settings"

export const AdvancedSettingsModal = () => {
  return (
    <DialogWrapper
      name={ADVANCED_SETTINGS_MODAL_NAME}
      trigger={
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
      }
    >
      <UserAdvancedSettings/>
    </DialogWrapper>
  )
}