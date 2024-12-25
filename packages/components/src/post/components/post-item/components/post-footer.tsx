import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useEffect } from "react";
import { postPostView } from "#post/components/post-item/queries/post-view.ts";
import { PostFooterViews } from "#post/components/post-item/components/post-footer-views.tsx";
import dynamic from "next/dynamic";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

type PostFooterProps = Pick<UserPostItem, "views_count" | "isUpdated" | "id" | "isViewed" | "user_nickname">

const PostFooterWithViewsList = dynamic(() =>
  import(
    "#post/components/post-item/components/post-footer-views-list.tsx"
  ).then((m) => m.PostFooterWithViewsList),
);

export const PostFooter = ({
  views_count, isUpdated, id, isViewed, user_nickname,
}: PostFooterProps) => {
  const currentUser = getUser();

  useEffect(() => {
    if (!isViewed && currentUser) postPostView(id);
  }, []);

  const isOwner = user_nickname === currentUser.nickname;

  return (
    <div className="flex w-full gap-4 justify-end items-center">
      {isUpdated && (
        <Typography textSize="small" textColor="gray" className="self-end">
          [изменено]
        </Typography>
      )}
      {isOwner && <PostFooterWithViewsList id={id} views_count={views_count} />}
      {!isOwner && <PostFooterViews views_count={views_count} />}
    </div>
  );
};
