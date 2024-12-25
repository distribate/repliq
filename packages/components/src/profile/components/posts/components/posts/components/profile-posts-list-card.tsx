import { PostItemHeader } from "#post/components/post-item/components/post-header.tsx";
import { PostItemBody } from "#post/components/post-item/components/post-body.tsx";
import { PostFooter } from "#post/components/post-item/components/post-footer.tsx";
import dynamic from "next/dynamic";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

const PostControl = dynamic(() =>
  import(
    "@repo/components/src/post/components/post-item/components/post-control.tsx"
  ).then((m) => m.PostControl),
);

type ProfilePostsListCardProps = Pick<UserPostItem,
  | "id"
  | "content"
  | "isPinned"
  | "created_at"
  | "user_nickname"
  | "isUpdated"
  | "views_count"
  | "visibility"
  | "isViewed"
>

export const ProfilePostsListCard = ({
  user_nickname, created_at, isPinned, id, content, visibility, views_count, isUpdated, isViewed
}: ProfilePostsListCardProps) => {
  return (
    <div className="flex bg-shark-950 rounded-lg w-full px-4 py-2 flex-col gap-y-2">
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between w-full items-center">
          <PostItemHeader
            user_nickname={user_nickname}
            isPinned={isPinned}
            visibility={visibility}
            created_at={created_at}
          />
          <PostControl id={id} nickname={user_nickname} />
        </div>
        <PostItemBody id={id} content={content} user_nickname={user_nickname} />
      </div>
      <PostFooter
        isViewed={isViewed}
        id={id}
        views_count={views_count}
        isUpdated={isUpdated}
        user_nickname={user_nickname}
      />
      {/*<PostComments id={id} comments_count={comments_count} />*/}
      {/*{isComments && <CreatePostCommentForm id={id} />}*/}
    </div>
  );
};