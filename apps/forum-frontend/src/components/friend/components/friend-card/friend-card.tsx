import { UserNickname } from "#components/user/name/nickname";
import { UserDonate } from "#components/user/donate/components/donate.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FriendCardLayout } from "#components/friend/components/friend-card/friend-card-layout";
import { FriendControl } from "#components/friend/components/friend-card-control/components/friend-control";
import { Pin } from "lucide-react";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import type { UserDetailed } from "@repo/types/entities/user-type";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserRealName } from "#components/user/real-name/real-name";
import { friendsViewAtom } from "#components/friends/components/filtering/models/friends-filtering.model";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";
import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { X } from "lucide-react";
import { setFriendUnnoteAction } from "#components/friend/models/control-friend.model";

type FriendCardNoteProps = Pick<FriendWithDetails, "friend_id" | "nickname"> & {
  note: string | null;
};

const FriendNote = reatomComponent<FriendCardNoteProps>(({
  ctx, note, friend_id, nickname: recipient,
}) => {
  return (
    <div className="flex items-center gap-2">
      <SelectedWrapper
        className="relative -bottom-1"
        onClick={() => setFriendUnnoteAction(ctx, { friend_id, recipient })}
      >
        <X className="text-red-500" size={16} />
      </SelectedWrapper>
      <Typography className="text-shark-300" textSize="medium">
        {note}
      </Typography>
    </div>
  );
}, "FriendCardNote")

type FriendCardProps = Pick<UserDetailed, "nickname" | "real_name" | "description" | "donate"> & FriendWithDetails

export const FriendCard = reatomComponent<FriendCardProps>(({
  ctx, real_name, description, donate, friend_id, is_pinned, note, nickname, name_color
}) => {
  return (
    <FriendCardLayout data-view={ctx.spy(friendsViewAtom).viewType}>
      <div className="md:hidden flex min-w-[48px] min-h-[48px] w-[48px] h-[48px]">
        <Avatar nickname={nickname} propHeight={48} propWidth={48} className="rounded-lg" />
      </div>
      <div className="hidden md:flex min-w-[112px] min-h-[112px] max-w-[112px] max-h-[112px] w-[112px] h-[112px]">
        <Avatar nickname={nickname} propHeight={112} propWidth={112} className="rounded-lg" />
      </div>
      <div className="flex flex-col group-data-[view=grid]:justify-between h-full sm:gap-y-1 w-full">
        <div className="flex items-start lg:items-center gap-1 w-full">
          <CustomLink to={createIdLink("user", nickname)} className="flex truncate lg:flex-row flex-col lg:items-center gap-1">
            <UserNickname nickname={nickname} className="text-lg leading-3" nicknameColor={name_color} />
            {real_name && <UserRealName real_name={real_name} with_annotation={false} />}
          </CustomLink>
          <UserDonate donate={donate} />
        </div>
        {description && (
          <div
            className="flex items-center w-fit max-w-[160px] 
              group-data-[view=grid]:sm:max-w-[240px] group-data-[view=list]:sm:max-w-[450px] group-data-[view=list]:lg:max-w-[600px]"
          >
            <Typography className="truncate leading-5">{description}</Typography>
          </div>
        )}
        <div className="flex items-center mt-4 sm:mt-2 gap-4 sm:justify-between justify-end w-full">
          <div className="order-last sm:order-first">
            <FriendControl friend_id={friend_id} nickname={nickname} is_pinned={is_pinned} />
          </div>
          {(is_pinned || !!note) && (
            <div className="flex items-center justify-center order-first sm:order-last gap-4">
              {note && (
                <FriendNote note={note} friend_id={friend_id} nickname={nickname} />
              )}
              {is_pinned && <Pin size={24} className="text-gold-500" />}
            </div>
          )}
        </div>
      </div>
    </FriendCardLayout>
  );
}, "FriendCard")