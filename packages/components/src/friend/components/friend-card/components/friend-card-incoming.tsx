import { Link } from "@tanstack/react-router";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { FriendCardLayout } from "#friend/components/friend-card/components/friend-card-layout.tsx";
import { useControlFriendRequests } from "#friend/components/friend-card/hooks/use-control-friend-requests.ts";

export const FriendCardIncoming = ({
  initiator,
  request_id,
}: {
  request_id: string;
  initiator: string;
}) => {
  const {
    rejectIncomingRequestMutation,
    acceptIncomingRequestMutation
  } = useControlFriendRequests();

  return (
    <FriendCardLayout nickname={initiator}>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link to={USER_URL + initiator}>
            <UserNickname nickname={initiator} className="text-lg" />
          </Link>
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Button
            onClick={() => acceptIncomingRequestMutation.mutate({ request_id, recipient: initiator })}
            variant="positive"
          >
            <Typography textSize="small">
              Принять заявку
            </Typography>
          </Button>
          <Button
            onClick={() => rejectIncomingRequestMutation.mutate({ request_id, recipient: initiator })}
            variant="negative"
          >
            <Typography textSize="small"
            >
              Отклонить заявку
            </Typography>
          </Button>
        </div>
      </div>
    </FriendCardLayout>
  );
};