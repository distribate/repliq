import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Campfire from '@repo/assets/images/minecraft/campfire.webp';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import { UserAdvancedSettings, } from '#cards/components/user-personal-card/components/advanced-settings/user-advanced-settings.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

export const AdvancedSettingsModal = () => {
  return (
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
  );
};