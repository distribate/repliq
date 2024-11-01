import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Plus, Minus } from 'lucide-react';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import {
  useControlFriendRequests,
} from '#friend/components/request-card/hooks/use-control-friend-requests.ts';
import { RequestProperties } from '#friend/components/request-card/queries/delete-friend-request.ts';

export const IncomingFriendButton = ({
  initiator,
}: RequestProperties) => {
  const { rejectIncomingRequestMutation, acceptIncomingRequestMutation } = useControlFriendRequests();
  
  const handleAcceptReq = () => acceptIncomingRequestMutation.mutate(
    initiator
  );
  const handleRejectReq = () => rejectIncomingRequestMutation.mutate({
    initiator, type: "incoming"
  });
  
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
            onClick={handleAcceptReq}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={acceptIncomingRequestMutation.isPending || acceptIncomingRequestMutation.isError}
            pending={acceptIncomingRequestMutation.isPending}
          >
            <Plus size={16} className="text-shark-300" />
            <Typography>
              Принять заявку
            </Typography>
          </Button>
          <Button
            onClick={handleRejectReq}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={rejectIncomingRequestMutation.isPending || rejectIncomingRequestMutation.isError}
            pending={rejectIncomingRequestMutation.isPending}
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