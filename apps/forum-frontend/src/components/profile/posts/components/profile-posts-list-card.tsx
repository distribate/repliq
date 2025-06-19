import { PostItemHeader } from "#components/post/post-item/components/post-header.tsx";
import { PostItemBody } from "#components/post/post-item/components/post-body.tsx";
import { PostFooter } from "#components/post/post-item/components/post-footer.tsx";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { lazy, Suspense } from "react";

const PostControl = lazy(() => import("#components/post/post-item/components/post-control.tsx").then((m) => ({ default: m.PostControl })));

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
    <div className="flex bg-shark-950 group rounded-lg w-full p-2 lg:p-4 flex-col gap-y-2">
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between w-full items-center">
          <PostItemHeader avatar={avatar} nickname={nickname} isPinned={isPinned} visibility={visibility} created_at={created_at} />
          <Suspense>
            <PostControl id={id} nickname={nickname} isComments={isComments} />
          </Suspense>
        </div>
        <PostItemBody id={id} content={content} nickname={nickname} />
      </div>
      <PostFooter
        isViewed={isViewed}
        id={id}
        views_count={views_count}
        isUpdated={isUpdated}
        nickname={nickname}
        created_at={created_at}
      />
    </div>
  );
};