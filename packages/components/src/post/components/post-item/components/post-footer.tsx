import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useEffect } from "react";
import { postPostView } from "#post/components/post-item/queries/post-view.ts";
import { PostFooterViews } from "#post/components/post-item/components/post-footer-views.tsx";
import dynamic from "next/dynamic";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import dayjs from "@repo/lib/constants/dayjs-instance";

type PostFooterProps = Pick<UserPostItem, "views_count" | "isUpdated" | "id" | "isViewed" | "user_nickname" | "created_at">

const PostFooterWithViewsList = dynamic(() =>
  import(
    "#post/components/post-item/components/post-footer-views-list.tsx"
  ).then((m) => m.PostFooterWithViewsList),
);

export const PostFooter = ({
  views_count, isUpdated, id, isViewed, user_nickname, created_at
}: PostFooterProps) => {
  const currentUser = getUser();

  useEffect(() => {
    if (!isViewed && currentUser) postPostView(id);
  }, []);

  const isOwner = user_nickname === currentUser.nickname;

  return (
    <div className="flex w-full select-none gap-4 group-hover:opacity-100 opacity-0 justify-end items-center">
      {isUpdated && (
        <Typography textSize="small" textColor="gray" className="self-end">
          [изменено]
        </Typography>
      )}
      {isOwner && <PostFooterWithViewsList id={id} views_count={views_count} />}
      {!isOwner && <PostFooterViews views_count={views_count} />}
      <div className="flex items-center gap-1">
        <Typography textSize="small" textColor="gray">
          {dayjs(created_at).format("HH:MM")}
        </Typography>
      </div>
    </div>
  );
};