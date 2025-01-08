import { Typography } from "@repo/ui/src/components/typography.tsx";
import Link from "next/link";
import { Button } from "@repo/ui/src/components/button.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { FriendCardLayout } from "#friend/components/friend-card/components/friend-card-layout.tsx";
import { ControlFriendRequests } from "#friend/components/friend-card/types/friend-request-types.ts";
import { useControlFriendRequests } from "#friend/components/friend-card/hooks/use-control-friend-requests.ts";

export const FriendCardOutgoing = ({
  recipient,
  request_id,
}: ControlFriendRequests) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests();

  return (
    <FriendCardLayout nickname={recipient}>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link href={USER_URL + recipient} className="flex items-center gap-1">
            <UserNickname nickname={recipient} className="text-lg" />
          </Link>
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Button
            onClick={() => rejectOutgoingRequestMutation.mutate({ request_id, recipient })}
            variant="pending"
            disabled={
              rejectOutgoingRequestMutation.isPending ||
              rejectOutgoingRequestMutation.isError
            }
          >
            <Typography textSize="small">Отменить заявку</Typography>
          </Button>
        </div>
      </div>
    </FriendCardLayout>
  );
};
