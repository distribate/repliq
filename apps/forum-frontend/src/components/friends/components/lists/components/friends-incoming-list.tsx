import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { friendsFilteringQuery } from "#components/friends/components/filtering/queries/friends-filtering-query.ts";
import { requestsIncomingQuery } from "#components/friends/queries/requests-incoming-query.ts";
import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests.ts";
import { FriendCardLayout } from "#components/friend/components/friend-card/components/friend-card-layout.tsx";
import { Suspense } from "react";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#components/user/name/components/nickname.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

const FriendIncomingCard = ({
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
    <FriendCardLayout>
      <Suspense fallback={<Skeleton className="w-[60px] h-[60px] lg:w-[112px] lg:h-[112px]" />}>
        <div className="md:hidden flex w-[60px] h-[60px]">
          <Avatar
            nickname={initiator}
            propHeight={60}
            propWidth={60}
            className="rounded-lg"
          />
        </div>
        <div className="hidden md:flex w-[112px] h-[112px]">
          <Avatar
            nickname={initiator}
            propHeight={112}
            propWidth={112}
            className="rounded-lg"
          />
        </div>
      </Suspense>
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

export const FriendsIncomingList = () => {
  const { data: friendsFiltering } = friendsFilteringQuery();
  const { data: incomingFriends } = requestsIncomingQuery();

  if (!incomingFriends) {
    return <ContentNotFound title="Входящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout variant={friendsFiltering.viewType}>
      {incomingFriends.map(friend => (
        <FriendIncomingCard key={friend.initiator} request_id={friend.id} {...friend} />
      ))}
    </FriendsListLayout>
  );
};