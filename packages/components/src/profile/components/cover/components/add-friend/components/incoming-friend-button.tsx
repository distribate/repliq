import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Plus, Minus } from 'lucide-react';
import { FriendButtonProps } from './outgoing-friend-button.tsx';
import { DropdownWrapper } from '../../../../../../wrappers/dropdown-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';

export const IncomingFriendButton = ({
  reqUserNickname
}: FriendButtonProps) => {
  
  
  
  return (
    <DropdownWrapper
      properties={{ sideAlign: 'right', contentAlign: 'start', }}
      trigger={
        <Button variant="pending">
          <Typography>
            Хочет добавить вас в друзья
          </Typography>
        </Button>
      }
      content={
        <div className="flex flex-col gap-y-1 *:w-full w-full items-center">
          <HoverCardItem className="gap-2 group">
            <Plus size={16} className="text-shark-300" />
            <Typography>
              Принять заявку
            </Typography>
          </HoverCardItem>
          <HoverCardItem className="gap-2 group">
            <Minus size={16} className="text-shark-300" />
            <Typography>
              Отклонить заявку
            </Typography>
          </HoverCardItem>
        </div>
      }
    />
  );
};