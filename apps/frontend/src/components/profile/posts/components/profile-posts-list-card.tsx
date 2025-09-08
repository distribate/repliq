import { PostItemHeader } from "#components/post/components/post-head/post-head";
import { PostItemBody } from "#components/post/components/post-body/post-body";
import { PostFooter } from "#components/post/components/post-footer/post-footer";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { lazy, Suspense } from "react";

const PostControl = lazy(() =>
  import("#components/post/components/post-control/post-control").then((m) => ({ default: m.PostControl }))
);

type ProfilePostsListCardProps = Pick<UserPostItem,
  | "id"
  | "content"
  | "isPinned"
  | "created_at"
  | "nickname"
  | "isUpdated"
  | "views_count"
  | "visibility"
  | "isViewed"
  | "isComments"
> & {
  avatar: string | null
}

export const ProfilePostsListCard = ({
  nickname, created_at, isPinned, id, content, visibility, views_count, isUpdated, isViewed, isComments, avatar
}: ProfilePostsListCardProps) => {
  return (
    <div className="flex bg-shark-950 group rounded-lg w-full p-2 sm:p-4 flex-col gap-y-2">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full items-center">
          <PostItemHeader
            nickname={nickname}
            created_at={created_at}
            avatar={avatar}
            visibility={visibility}
            isPinned={isPinned}
          />
          <Suspense>
            <PostControl id={id} nickname={nickname} />
          </Suspense>
        </div>
        <PostItemBody id={id} nickname={nickname} content={content} />
      </div>
      <PostFooter
        id={id}
        nickname={nickname}
        views_count={views_count}
        isViewed={isViewed}
        isUpdated={isUpdated}
      />
    </div>
  );
};