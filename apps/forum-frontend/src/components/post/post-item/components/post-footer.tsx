import { Typography } from "@repo/ui/src/components/typography.tsx";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import { lazy, Suspense } from "react";
import { PostFooterViews } from "#components/post/post-item/components/post-footer-views.tsx";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import dayjs from "@repo/lib/constants/dayjs-instance";
import { reatomComponent } from "@reatom/npm-react";

type PostFooterProps = Pick<UserPostItem, "views_count" | "isUpdated" | "id" | "isViewed" | "nickname" | "created_at">

const PostFooterWithViewsList = lazy(() =>
  import("#components/post/post-item/components/post-footer-views-list.tsx").then((m) => ({
    default: m.PostFooterWithViewsList,
  })),
);

export const PostFooter = reatomComponent<PostFooterProps>(({
  ctx, views_count, isUpdated, id, nickname, created_at
}) => {
  const currentUserNickname = ctx.spy(currentUserNicknameAtom)

  const isOwner = nickname === currentUserNickname;

  return (
    <div className="flex w-full select-none gap-4 group-hover:opacity-100 opacity-0 justify-end items-center">
      {isUpdated && (
        <Typography textSize="small" textColor="gray" className="self-end">
          [изменено]
        </Typography>
      )}
      {isOwner && (
        <Suspense>
          <PostFooterWithViewsList id={id} views_count={views_count} />
        </Suspense>
      )}
      {!isOwner && <PostFooterViews views_count={views_count} />}
      <div className="flex items-center gap-1">
        <Typography textSize="small" textColor="gray">
          {dayjs(created_at).format("HH:MM")}
        </Typography>
      </div>
    </div>
  );
}, "PostFooter")