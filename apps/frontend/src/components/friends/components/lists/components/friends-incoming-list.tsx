import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { controlIncomingRequestAction } from "#components/friend/models/control-friend-requests.model.ts";
import { Avatar } from "#components/user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/components/name/nickname.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { incomingRequestsAction, incomingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";
import { CustomLink } from "#shared/components/link.tsx";
import { createIdLink } from "#lib/create-link.ts";
import { friendCardVariant } from "#components/friend/components/friend-card/friend-card-layout.tsx";
import { AtomState } from "@reatom/core";
import { SectionSkeleton } from "#components/templates/components/section-skeleton.tsx";
import { onDisconnect } from "@reatom/framework";

type FriendIncomindCardProps = NonNullable<AtomState<typeof incomingRequestsAtom>>[number]

const FriendIncomingCard = reatomComponent<FriendIncomindCardProps>(({ 
  ctx, avatar, initiator, id: request_id, name_color
}) => {
  const handle = (type: "accept" | "reject") => {
    controlIncomingRequestAction(ctx, { type, request_id, recipient: initiator })
  }

  return (
    <div className={friendCardVariant()}>
      <div
        className="flex aspect-square 
          min-h-16 h-16 max-h-16
          md:min-h-24 md:h-24 md:max-h-24"
      >
        <Avatar
          url={avatar}
          nickname={initiator}
          propHeight={112}
          propWidth={112}
          className="aspect-square 
            min-h-16 h-16 max-h-16
            md:min-h-24 md:h-24 md:max-h-24
        "
        />
      </div>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <CustomLink to={createIdLink("user", initiator)}>
            <UserNickname nickname={initiator} nicknameColor={name_color} className="text-lg" />
          </CustomLink>
        </div>
        <div className="flex items-center mt-2 gap-1 w-fit">
          <Button variant="positive" onClick={() => handle('accept')}>
            <Typography textSize="small">Принять заявку</Typography>
          </Button>
          <Button variant="negative" onClick={() => handle('reject')}>
            <Typography textSize="small">Отклонить заявку</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}, "FriendIncomingCard")

onDisconnect(incomingRequestsAtom, (ctx) => incomingRequestsAtom.reset(ctx))

export const FriendsIncomingList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(incomingRequestsAtom)
  const isExist = data && data.length >= 1;

  if (ctx.spy(incomingRequestsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }
 
  if (!isExist) {
    return <ContentNotFound title="Входящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout>
      {data.map((user) => <FriendIncomingCard key={user.initiator} {...user} />)}
    </FriendsListLayout>
  )
}, "FriendsIncomingList")