import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { FriendCardLayout } from "#friend/components/friend-card/components/friend-card-layout.tsx";
import { FriendRequestProperties } from "#friend/components/friend-card/types/friend-request-types.ts";
import { useControlFriendRequests } from "#friend/components/friend-card/hooks/use-control-friend-requests.ts";

export const FriendCardIncoming = ({
  initiator,
}: Pick<FriendRequestProperties, "initiator">) => {
  const {
    rejectIncomingRequestMutation,
    acceptIncomingRequestMutation
  } = useControlFriendRequests();

  const handleAcceptRequest = () => acceptIncomingRequestMutation.mutate(initiator);
  const handleRejectRequest = () => rejectIncomingRequestMutation.mutate(initiator);

  return (
    <FriendCardLayout nickname={initiator}>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link href={USER_URL + initiator}>
            <UserNickname nickname={initiator} className="text-lg" />
          </Link>
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Button onClick={handleAcceptRequest} variant="positive">
            <Typography textSize="small">Принять заявку</Typography>
          </Button>
          <Button onClick={handleRejectRequest} variant="negative">
            <Typography textSize="small">Отклонить заявку</Typography>
          </Button>
        </div>
      </div>
    </FriendCardLayout>
  );
};
