import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useControlFriendRequests } from '../hooks/use-control-friend-requests.ts';
import { FriendRequestProperties } from '../../types/friend-request-types.ts';
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { UserNickname } from '../../../../user/components/name/components/nickname.tsx';
import { UserDonate } from '../../../../user/components/donate/components/donate.tsx';

export const FriendRequestOutgoingCard = ({
  recipient
}: Pick<FriendRequestProperties, 'recipient'>) => {
  const { rejectIncomingRequestMutation } = useControlFriendRequests();
  
  const handleRejectReq = () => {
    rejectIncomingRequestMutation.mutate({
      initiator: recipient, type: "outgoing"
    });
  };
  
  return (
    <div
      key={recipient}
      className="flex items-center gap-4 w-full bg-shark-950 border border-shark-800 rounded-lg p-4"
    >
      <Avatar
        nickname={recipient}
        propHeight={112}
        propWidth={112}
        className="rounded-lg"
      />
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link href={USER_URL + recipient} className="flex items-center gap-1">
            <UserNickname nickname={recipient} className="text-lg" />
          </Link>
          <UserDonate nickname={recipient} />
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Button
            onClick={handleRejectReq}
            variant="pending"
            disabled={rejectIncomingRequestMutation.isPending || rejectIncomingRequestMutation.isError}
            pending={rejectIncomingRequestMutation.isPending}
          >
            <Typography textSize="small">
              Отменить заявку
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};