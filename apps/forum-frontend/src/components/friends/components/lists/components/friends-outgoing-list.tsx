import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { controlOutgoingRequestAction } from "#components/friend/models/control-friend-requests.model.ts";
import { FriendCardLayout } from "#components/friend/components/friend-card/friend-card-layout.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { ControlFriendRequests } from "#components/friend/models/control-friend.model.ts";
import { outgoingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";

const FriendOutgoingCard = reatomComponent<ControlFriendRequests>(({
  ctx, recipient, request_id
}) => {
  return (
    <FriendCardLayout>
      <div
        className="flex min-w-[48px] min-h-[48px] max-h-[48px] max-w-[48px] w-[48px] h-[48px] 
          md:max-w-[112px] md:max-h-[112px] md:min-w-[112px] md:min-h-[112px] md:w-[112px] md:h-[112px]"
      >
        <Avatar nickname={recipient} propHeight={112} propWidth={112} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-y-1 w-full">
        <div className="flex items-center gap-1 w-fit">
          <Link to={USER_URL + recipient} className="flex items-center gap-1">
            <UserNickname nickname={recipient} className="text-lg leading-3" />
          </Link>
        </div>
        <div className="flex md:justify-start justify-end items-center mt-2 w-full">
          <Button
            onClick={() => controlOutgoingRequestAction(ctx, { type: "reject", request_id, recipient })}
            variant="pending"
            disabled={
              ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending ||
              ctx.spy(controlOutgoingRequestAction.statusesAtom).isRejected
            }
          >
            <Typography textSize="small" className="truncate">Отменить заявку</Typography>
          </Button>
        </div>
      </div>
    </FriendCardLayout>
  );
}, "FriendOutgoingCard")

export const FriendsOutgoingList = reatomComponent(({ ctx }) => {
  const outgoingFriends = ctx.spy(outgoingRequestsAtom)

  if (!outgoingFriends || !outgoingFriends.length) {
    return <ContentNotFound title="Исходящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout>
      {outgoingFriends.map(({ recipient, id }) => (
        <FriendOutgoingCard key={recipient} request_id={id} recipient={recipient} />
      ))}
    </FriendsListLayout>
  )
})