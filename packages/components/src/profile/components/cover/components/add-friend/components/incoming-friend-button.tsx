import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Plus, Minus } from 'lucide-react';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';
import { useControlFriendRequests } from '#friend/components/friend-card/hooks/use-control-friend-requests.ts';

export const IncomingFriendButton = ({
  initiator
}: Pick<FriendRequestProperties, "initiator">) => {
  const { rejectIncomingRequestMutation, acceptIncomingRequestMutation } = useControlFriendRequests();
  
  const handleAcceptRequest = () => {
    return acceptIncomingRequestMutation.mutate(initiator);
  }
  
  const handleRejectRequest = () => {
    return rejectIncomingRequestMutation.mutate(initiator);
  }
  
  return (
    <DropdownWrapper
      properties={{ sideAlign: 'right', contentAlign: 'start' }}
      trigger={
        <Button variant="pending">
          <Typography>
            Хочет добавить вас в друзья
          </Typography>
        </Button>
      }
      content={
        <div className="flex flex-col gap-y-1 *:w-full w-full">
          <Button
            onClick={handleAcceptRequest}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={acceptIncomingRequestMutation.isPending || acceptIncomingRequestMutation.isError}
          >
            <Plus size={16} className="text-shark-300" />
            <Typography>
              Принять заявку
            </Typography>
          </Button>
          <Button
            onClick={handleRejectRequest}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={rejectIncomingRequestMutation.isPending || rejectIncomingRequestMutation.isError}
          >
            <Minus size={16} className="text-shark-300" />
            <Typography>
              Отклонить заявку
            </Typography>
          </Button>
        </div>
      }
    />
  );
};