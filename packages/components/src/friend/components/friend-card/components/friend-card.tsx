import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserRealName } from "#user/components/real-name/real-name.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FriendCardLayout } from "#friend/components/friend-card/components/friend-card-layout.tsx";
import { FriendCardControl } from "#friend/components/friend-card/components/friend-card-control.tsx";
import { FriendCardNote } from "#friend/components/friend-card/components/friend-card-note.tsx";
import { Pin } from "lucide-react";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import type { UserDetailed } from "@repo/types/entities/user-type";
import { Link } from "@tanstack/react-router"
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";

export type FriendCardProps = Pick<
  UserDetailed, "nickname" | "real_name" | "description" | "donate"
> & FriendWithDetails

export const FriendCard = ({
  ...friend
}: FriendCardProps) => {
  const {
    real_name, description, donate,
    favorite_item, nickname, name_color, friend_id, note, is_pinned
  } = friend;

  return (
    <FriendCardLayout>
      <Suspense fallback={<Skeleton className="w-[60px] h-[60px] lg:w-[112px] lg:h-[112px]" />}>
        <div className="md:hidden flex w-[60px] h-[60px]">
          <Avatar
            nickname={nickname}
            propHeight={60}
            propWidth={60}
            className="rounded-lg"
          />
        </div>
        <div className="hidden md:flex w-[112px] h-[112px]">
          <Avatar
            nickname={nickname}
            propHeight={112}
            propWidth={112}
            className="rounded-lg"
          />
        </div>
      </Suspense>
      <div className="flex flex-col gap-y-1 w-fit">
        <div className="flex items-start lg:items-center gap-1 w-full">
          <Link to={USER_URL + nickname} className="flex truncate lg:flex-row max-w-[200px] sm:max-w-[450px] lg:max-w-[600px] flex-col lg:items-center gap-1">
            <UserNickname
              nickname={nickname}
              className="text-lg"
              nicknameColor={name_color}
            />
            {real_name && <UserRealName real_name={real_name} with_annotation={false} />}
          </Link>
          <UserDonate donate={donate} />
        </div>
        {description && (
          <div className="flex items-center w-fit max-w-[200px] sm:max-w-[450px] lg:max-w-[600px]">
            <Typography className="truncate">{description}</Typography>
          </div>
        )}
        <FriendCardControl
          friend_id={friend_id}
          nickname={nickname}
          is_pinned={is_pinned}
        />
        {(is_pinned || !!note) && (
          <div className="flex items-end gap-4 absolute right-4 bottom-4">
            {note && (
              <FriendCardNote
                note={note}
                friend_id={friend_id}
                nickname={nickname}
              />
            )}
            {is_pinned && <Pin size={24} className="text-gold-500" />}
          </div>
        )}
      </div>
    </FriendCardLayout>
  );
};