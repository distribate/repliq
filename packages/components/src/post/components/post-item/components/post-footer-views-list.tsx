import { useState } from "react";
import {
  PostViewsQuery,
  postViewsQuery,
} from "#post/components/post-item/queries/post-views-query.ts";
import { HoverCardWrapper } from "#wrappers/hover-card-wrapper.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { PostFooterViews } from "#post/components/post-item/components/post-footer-views.tsx";
import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

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
        <Link href={USER_URL + nickname}>
          <UserNickname nickname={nickname} className="truncate text-[14px]" />
        </Link>
      </div>
      <Typography textSize="small" textColor="gray">
        {dayjs(viewCreatedAt).fromNow()}
      </Typography>
    </div>
  );
};

export const PostFooterWithViewsList = ({
  id,
  views_count,
}: PostFooterWithViewsListProps) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const { data: postViews, isLoading } = postViewsQuery({ id, enabled });

  return (
    <HoverCardWrapper
      trigger={
        <div onMouseEnter={() => setEnabled(true)}>
          <PostFooterViews views_count={views_count} />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2 w-full p-1">
          <Typography textSize="small" className="text-shark-300">
            Просмотрено
          </Typography>
          {isLoading && <PostFooterViewsListSkeleton />}
          <div className="flex flex-col gap-y-2">
            {!isLoading &&
              postViews &&
              postViews.map((user) => (
                <PostViewCard key={user.nickname} {...user} />
              ))}
          </div>
        </div>
      }
    />
  );
};
