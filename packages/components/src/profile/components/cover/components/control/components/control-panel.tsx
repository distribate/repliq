import { Ellipsis } from 'lucide-react';
import { DropdownWrapper } from '../../../../../../wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Ban, FlagTriangleLeft  } from 'lucide-react';

export const ControlPanel = () => {
  return (
    <div className="*:h-full h-full w-fit">
      <DropdownWrapper
        properties={{ sideAlign: 'bottom', contentAlign: 'end', }}
        trigger={
          <div className="flex items-center justify-center h-full bg-shark-800/50 rounded-lg px-2 py-1">
            <Ellipsis size={20} className="rotate-90 text-shark-50" />
          </div>
        }
        content={
          <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
            <HoverCardItem className="group gap-2">
              <Ban size={16} className="text-shark-300"/>
              <Typography>
                Добавить в черный список
              </Typography>
            </HoverCardItem>
            <Separator/>
            <HoverCardItem className="group gap-2">
              <FlagTriangleLeft size={16} className="text-red-500"/>
              <Typography className="text-red-500" textSize="small">
                Пожаловаться
              </Typography>
            </HoverCardItem>
          </div>
        }
      />
    </div>
  );
};