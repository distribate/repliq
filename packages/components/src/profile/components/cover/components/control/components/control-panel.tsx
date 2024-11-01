import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Ban, FlagTriangleLeft } from 'lucide-react';
import { MoreWrapper } from '#wrappers/more-wrapper.tsx';

export const ControlPanel = () => {
  return (
    <MoreWrapper variant="selected" position="bottom-left">
      <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
        <HoverCardItem className="group gap-2">
          <Ban size={16} className="text-shark-300" />
          <Typography>
            Добавить в черный список
          </Typography>
        </HoverCardItem>
        <Separator />
        <HoverCardItem className="group gap-2">
          <FlagTriangleLeft size={16} className="text-red-500" />
          <Typography className="text-red-500" textSize="small">
            Пожаловаться
          </Typography>
        </HoverCardItem>
      </div>
    </MoreWrapper>
  );
};