import { useState } from "react";
import {
  postViewsAction,
  PostViewsQuery,
} from "#components/post/post-item/queries/post-views-query.ts";
import { HoverCardWrapper } from "#components/wrappers/components/hover-card-wrapper";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { PostFooterViews } from "#components/post/post-item/components/post-footer-views.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { reatomComponent, useUpdate } from "@reatom/npm-react";

type PostFooterWithViewsListProps = Pick<PostViewsQuery, "id"> &
  Pick<UserPostItem, "views_count">;

const PostFooterViewsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
};

const PostViewCard = ({
  nickname,
  created_at: viewCreatedAt,
}: Pick<UserEntity, "nickname" | "created_at">) => {
  return (
    <div
      key={nickname}
      className="flex justify-between h-6 items-center gap-2 w-full"
    >
      <div className="flex items-center gap-2 w-1/2 justify-between">
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname} className="truncate text-[14px]" />
        </Link>
      </div>
      <Typography textSize="small" textColor="gray">
        {dayjs(viewCreatedAt).fromNow()}
      </Typography>
    </div>
  );
};

const Sync = ({ target, enabled }: { target: string, enabled: boolean }) => {
  useUpdate((ctx) => postViewsAction(ctx, { id: target, enabled }), [target, enabled])
  return null;
}

const ViewsList = reatomComponent<PostFooterWithViewsListProps & { enabled: boolean }>(({ 
  ctx, enabled, id, views_count 
}) => {
  const postViews = ctx.spy(postViewsAction.dataAtom);
  const isLoading = ctx.spy(postViewsAction.statusesAtom).isPending

  return (
    <>
      <Sync target={id} enabled={enabled && views_count > 0} />
      {!postViews || !views_count && (
        <div className="flex flex-col gap-y-2 w-full p-1">
          <Typography textSize="small" textColor="gray">
            Пока никто не просмотрел этот пост
          </Typography>
        </div>
      )}
      {isLoading && <PostFooterViewsListSkeleton />}
      {(postViews && !isLoading) && (
        <div className="flex flex-col gap-y-2 w-full p-1">
          <Typography textSize="small" className="text-shark-300">
            Просмотрено
          </Typography>
          <div className="flex flex-col gap-y-2">
            {postViews.map(u => <PostViewCard key={u.nickname} {...u} />)}
          </div>
        </div>
      )}
    </>
  )
}, "ViewsList")

export const PostFooterWithViewsList = ({ id, views_count }: PostFooterWithViewsListProps) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <HoverCardWrapper
      trigger={
        <div onMouseEnter={() => setEnabled(true)}>
          <PostFooterViews views_count={views_count} />
        </div>
      }
      content={
        enabled && (
          <ViewsList id={id} enabled={enabled} views_count={views_count} />
        )
      }
    />
  );
};