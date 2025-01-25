import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Link } from "@tanstack/react-router";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Pin } from "lucide-react";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

type PostItemHeaderProps = Pick<UserPostItem, "visibility" | "isPinned" | "created_at" | "user_nickname">;

export const PostItemHeader = ({
  user_nickname, created_at: postCreatedAt, visibility, isPinned,
}: PostItemHeaderProps) => {
  const dateCreated = dayjs(postCreatedAt).fromNow();
  const visibilityStatus =
    visibility === "only" ? "видно только вам" : "видно только друзьям";

  return (
    <div className="flex gap-3 items-center">
      <Link to={USER_URL + user_nickname}>
        <Avatar
          variant="page"
          propHeight={48}
          propWidth={48}
          nickname={user_nickname}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link to={USER_URL + user_nickname}>
            <UserNickname
              nickname={user_nickname}
              className="text-base font-medium"
            />
          </Link>
          {visibility !== "all" && (
            <Typography textSize="small" textColor="gray" className="self-end">
              {visibilityStatus}
            </Typography>
          )}
          {isPinned && <Pin size={18} className="text-gold-500" />}
        </div>
        <Typography className="text-shark-200 text-sm">
          {dateCreated}
        </Typography>
      </div>
    </div>
  );
};
