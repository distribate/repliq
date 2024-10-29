import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import MinecartWithChest from "@repo/assets/images/minecraft/minecart_chest.webp"
import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import {
  UserSettingsCard
} from '../../cards/components/user-personal-card/components/account-settings/user-settings-card.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

export const AccountSettingsModal = () => {
  return (
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
        <UserSettingsCard/>
      </DialogContent>
    </Dialog>
  )
}