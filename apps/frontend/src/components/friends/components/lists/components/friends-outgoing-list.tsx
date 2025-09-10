import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { FriendsListLayout } from "./friends-list-layout.tsx";
import { controlOutgoingRequestAction } from "#components/friend/models/control-friend-requests.model.ts";
import { Avatar } from "#components/user/components/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { UserNickname } from "#components/user/components/name/nickname.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { outgoingRequestsAction, outgoingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";
import { AtomState, spawn } from "@reatom/framework";
import { CustomLink } from "#shared/components/link.tsx";
import { createIdLink } from "#shared/helpers/create-link.ts";
import { friendCardVariant } from "#components/friend/components/friend-card/friend-card-layout.tsx";
import { SectionSkeleton } from "#components/templates/components/section-skeleton.tsx";

type FriendOutgoingCardProps = NonNullable<AtomState<typeof outgoingRequestsAtom>>[number]

const FriendOutgoingCard = reatomComponent<FriendOutgoingCardProps>(({
  ctx, recipient, id: request_id, avatar, name_color
}) => {
  const handle = () => {
    void spawn(ctx, async (spawnCtx) => controlOutgoingRequestAction(spawnCtx, { type: "reject", request_id, recipient }))
  }

  const isDisabled = ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending ||
    ctx.spy(controlOutgoingRequestAction.statusesAtom).isRejected;

  return (
    <div className={friendCardVariant()}>
      <div
        className="flex aspect-square 
          min-h-16 h-16 max-h-16
          md:min-h-24 md:h-24 md:max-h-24"
      >
        <Avatar
          url={avatar}
          nickname={recipient}
          propHeight={112}
          propWidth={112}
          className="aspect-square 
            min-h-16 h-16 max-h-16
            md:min-h-24 md:h-24 md:max-h-24
        "
        />
      </div>
      <div className="flex flex-col gap-y-1 w-full">
        <div className="flex items-center gap-1 w-fit">
          <CustomLink to={createIdLink("user", recipient)} className="flex items-center gap-1">
            <UserNickname nickname={recipient} nicknameColor={name_color} className="text-lg leading-3" />
          </CustomLink>
        </div>
        <div className="flex md:justify-start justify-end items-center mt-2 w-full">
          <Button
            variant="pending"
            disabled={isDisabled}
            onClick={handle}
          >
            <Typography textSize="small" className="truncate">
              Отменить заявку
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}, "FriendOutgoingCard")

export const FriendsOutgoingList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(outgoingRequestsAtom)
  const isExist = data && data.length >= 1;

  if (ctx.spy(outgoingRequestsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!isExist) {
    return <ContentNotFound title="Исходящих заявок в друзья нет" />;
  }

  return (
    <FriendsListLayout>
      {data.map((user) => <FriendOutgoingCard key={user.recipient} {...user} />)}
    </FriendsListLayout>
  )
}, "FriendsOutgoingList")