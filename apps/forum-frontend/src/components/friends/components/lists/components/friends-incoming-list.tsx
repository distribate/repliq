import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { controlIncomingRequestAction } from "#components/friend/models/control-friend-requests.model.ts";
import { FriendCardLayout } from "#components/friend/components/friend-card/friend-card-layout.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { incomingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";
import { CustomLink } from "#components/shared/link.tsx";

const FriendIncomingCard = reatomComponent<{ request_id: string; initiator: string; }>(({ ctx, initiator, request_id, }) => {
  return (
    <FriendCardLayout>
      <div
        className="flex min-w-[60px] min-h-[60px] w-[60px] h-[60px] max-h-[60px] max-w-[60px] 
        md:w-[112px] md:h-[112px] md:min-h-[112px] md:min-w-[112px] md:max-w-[112px] md:max-h-[112px]"
      >
        <Avatar nickname={initiator} propHeight={112} propWidth={112} className="rounded-lg" />
      </div>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <CustomLink to={USER_URL + initiator}>
            <UserNickname nickname={initiator} className="text-lg" />
          </CustomLink>
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Button
            onClick={() => controlIncomingRequestAction(ctx, { type: "accept", request_id, recipient: initiator })}
            variant="positive"
          >
            <Typography textSize="small">
              Принять заявку
            </Typography>
          </Button>
          <Button
            onClick={() => controlIncomingRequestAction(ctx, { type: "reject", request_id, recipient: initiator })}
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
}, "FriendIncomingCard")

export const FriendsIncomingList = reatomComponent(({ ctx }) => {
  const incomingFriends = ctx.spy(incomingRequestsAtom)

  if (!incomingFriends || !incomingFriends.length) {
    return <ContentNotFound title="Входящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout>
      {incomingFriends.map(({ initiator, id }) => (
        <FriendIncomingCard key={initiator} request_id={id} initiator={initiator} />
      ))}
    </FriendsListLayout>
  )
})