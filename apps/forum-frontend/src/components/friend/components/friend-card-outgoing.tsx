import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/src/components/button.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { FriendCardLayout } from "#components/friend/components/friend-card-layout.tsx";
import { ControlFriendRequests } from "#components/friend/types/friend-request-types.ts";
import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export const FriendCardOutgoing = ({
  recipient,
  request_id,
}: ControlFriendRequests) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests();

  return (
    <FriendCardLayout>
      <Suspense fallback={<Skeleton className="w-[60px] h-[60px] lg:w-[112px] lg:h-[112px]" />}>
        <div className="md:hidden flex w-[60px] h-[60px]">
          <Avatar
            nickname={recipient}
            propHeight={60}
            propWidth={60}
            className="rounded-lg"
          />
        </div>
        <div className="hidden md:flex w-[112px] h-[112px]">
          <Avatar
            nickname={recipient}
            propHeight={112}
            propWidth={112}
            className="rounded-lg"
          />
        </div>
      </Suspense>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link to={USER_URL + recipient} className="flex items-center gap-1">
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
