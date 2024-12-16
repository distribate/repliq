import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserRealName } from "#user/components/real-name/real-name.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FriendCardLayout } from "#friend/components/friend-card/components/friend-card-layout.tsx";
import { FriendCardControl } from "#friend/components/friend-card/components/friend-card-control.tsx";
import { FriendCardNote } from "#friend/components/friend-card/components/friend-card-note.tsx";
import { Pin } from "lucide-react";
import { UserFriends } from "#friends/queries/get-friends.ts";
import { CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export type FriendCardProps = Pick<
  CurrentUser,
  "nickname" | "real_name" | "description" | "favorite_item" | "donate"
> &
  UserFriends;

export const FriendCard = ({
  ...friend
}: FriendCardProps) => {
  const { real_name, description, donate, favorite_item, nickname, name_color, friend_id, note, isPinned } = friend;

  return (
    <FriendCardLayout nickname={nickname}>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-center gap-1 w-fit">
          <Link href={USER_URL + nickname} className="flex items-center gap-1">
            <UserNickname
              nickname={nickname}
              className="text-lg"
              nicknameColor={name_color}
            />
            {real_name && (
              <UserRealName real_name={real_name} with_annotation={false} />
            )}
          </Link>
          <UserDonate donate={donate} favoriteItemId={favorite_item} />
        </div>
        {description && (
          <div className="flex items-center w-fit">
            <Typography>{description}</Typography>
          </div>
        )}
        <FriendCardControl
          friend_id={friend_id}
          nickname={nickname}
          isPinned={isPinned}
        />
        {(isPinned || !!note) && (
          <div className="flex items-end gap-4 absolute right-4 bottom-4">
            {note && (
              <FriendCardNote
                note={note}
                friend_id={friend_id}
                nickname={nickname}
              />
            )}
            {isPinned && <Pin size={24} className="text-gold-500" />}
          </div>
        )}
      </div>
    </FriendCardLayout>
  );
};