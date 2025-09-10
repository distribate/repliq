import { UserNickname } from "#components/user/components/name/nickname";
import { UserDonate } from "#components/user/components/donate/components/donate";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { friendCardVariant } from "#components/friend/components/friend-card/friend-card-layout";
import { FriendControl } from "#components/friend/components/friend-card-control/components/friend-control";
import { Friend } from "@repo/types/schemas/friend/friend-types.ts";
import type { UserDetailed } from "@repo/types/entities/user-type";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#shared/helpers/create-link";
import { selectedVariant } from "#ui/selected-wrapper";
import { setFriendUnnoteAction } from "#components/friend/models/control-friend.model";
import { IconX } from "@tabler/icons-react";

type FriendCardNoteProps = Pick<Friend, "friend_id" | "nickname"> & {
  note: string | null;
};

type FriendCardProps = Pick<UserDetailed, "nickname" | "real_name" | "description" | "is_donate" | "avatar"> & Friend

const FriendNote = reatomComponent<FriendCardNoteProps>(({
  ctx, note, friend_id, nickname: recipient,
}) => {
  return (
    <div className={selectedVariant({ className: "flex h-full items-center gap-2 relative py-0.5 px-2" })}>
      <Typography className="text-shark-50 truncate leading-5">
        {note}
      </Typography>
      <IconX
        className="text-red-500 cursor-pointer"
        size={16}
        onClick={() => setFriendUnnoteAction(ctx, { friend_id, recipient })}
      />
    </div>
  );
}, "FriendCardNote")

export const FriendCard = reatomComponent<FriendCardProps>(({
  ctx, real_name, description, avatar, is_donate, friend_id, is_pinned, note, nickname, name_color
}) => {
  return (
    <div
      className={friendCardVariant({ variant: is_pinned ? "pinned" : "default" })}
    >
      <div
        className="flex aspect-square 
          min-h-16 h-16 max-h-16
          md:min-h-24 md:h-24 md:max-h-24"
      >
        <Avatar
          url={avatar}
          nickname={nickname}
          propHeight={112}
          propWidth={112}
          className="aspect-square 
            min-h-16 h-16 max-h-16
            md:min-h-24 md:h-24 md:max-h-24
        "
        />
      </div>
      <div className="flex items-center justify-between h-full sm:gap-1 w-full">
        <div className="flex flex-col sm:gap-2">
          <div className="flex flex-col">
            <div className="flex items-start lg:items-center gap-1 w-full">
              <CustomLink
                to={createIdLink("user", nickname)}
                className="flex truncate lg:flex-row flex-col lg:items-center gap-1"
              >
                <UserNickname
                  nickname={nickname}
                  className="text-lg leading-6"
                  nicknameColor={name_color}
                />
              </CustomLink>
              {is_donate && <UserDonate />}
            </div>
            {description && (
              <div
                className="flex items-center w-fit max-w-[160px] sm:max-w-[450px] lg:max-w-[600px]"
              >
                <Typography className="truncate leading-5">
                  {description}
                </Typography>
              </div>
            )}
          </div>
          <div className="flex items-center h-8 gap-3">
            <CustomLink to={createIdLink("user", nickname)} className="flex items-center h-full">
              <Typography className="text-nowrap text-base font-semibold text-shark-300">
                К профилю {`>`}
              </Typography>
            </CustomLink>
            {note && <FriendNote note={note} friend_id={friend_id} nickname={nickname} />}
          </div>
        </div>
        <div className="flex items-center h-full">
          <div className="flex items-center gap-1 w-fit">
            <FriendControl
              friend_id={friend_id}
              nickname={nickname}
              is_pinned={is_pinned}
            />
          </div>
        </div>
      </div>
    </div>
  );
}, "FriendCard")