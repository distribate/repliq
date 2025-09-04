import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model.ts";
import { PostFooterViews } from "#components/post/post-item/components/post-footer-views.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { clientOnly } from "vike-react/clientOnly";

type PostFooterProps = Pick<UserPostItem, "views_count" | "isUpdated" | "id" | "isViewed" | "nickname">

const PostFooterWithViewsList = clientOnly(() =>
  import("#components/post/post-item/components/post-footer-views-list.tsx").then((m) => m.PostFooterWithViewsList),
);

export const PostFooter = reatomComponent<PostFooterProps>(({
  ctx, views_count, isUpdated, id, nickname
}) => {
  const currentUserNickname = ctx.spy(currentUserNicknameAtom)
  const isOwner = nickname === currentUserNickname;

  return (
    <div className="flex w-full select-none gap-4 justify-end items-center">
      {isUpdated && <Typography className="text-sm text-shark-300 self-end">изм.</Typography>}
      {isOwner && <PostFooterWithViewsList id={id} views_count={views_count} />}
      {!isOwner && <PostFooterViews views_count={views_count} />}
    </div>
  );
}, "PostFooter")