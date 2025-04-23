import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { friendsFilteringQuery } from "#components/friends/components/filtering/queries/friends-filtering-query.ts";
import { requestsOutgoingQuery } from "#components/friends/queries/requests-outgoing-query.ts";
import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests.ts";
import { FriendCardLayout } from "#components/friend/components/friend-card/components/friend-card-layout.tsx";
import { Suspense } from "react";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { UserNickname } from "#components/user/name/components/nickname.tsx";
import { ControlFriendRequests } from "#components/friend/types/friend-request-types.ts";

const FriendOutgoingCard = ({
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

export const FriendsOutgoingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery();
  const { data: outgoingFriends } = requestsOutgoingQuery();

  if (!outgoingFriends || (outgoingFriends && !outgoingFriends.length)) {
    return <ContentNotFound title="Исходящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {outgoingFriends.map(({ initiator, recipient, id: request_id }) => (
        <FriendOutgoingCard
          key={recipient}
          request_id={request_id}
          recipient={recipient}
        />
      ))}
    </FriendsListLayout>
  );
};