import { OverridedPosts } from "#profile/components/posts/components/posts/queries/get-posts.ts";
import { ProfilePostsListProps } from "#profile/components/posts/components/posts/components/profile-posts-list.tsx";
import { PostItemHeader } from "#post/components/post-item/components/post-header.tsx";
import { PostItemBody } from "#post/components/post-item/components/post-body.tsx";
import { PostFooter } from "#post/components/post-item/components/post-footer.tsx";
import dynamic from "next/dynamic";

type ProfilePostsListCardProps = OverridedPosts & ProfilePostsListProps;

const PostControl = dynamic(() =>
  import(
    "@repo/components/src/post/components/post-item/components/post-control.tsx"
  ).then((m) => m.PostControl),
);

export const ProfilePostsListCard = ({
  ...values
}: ProfilePostsListCardProps) => {
  const {
    id,
    content,
    isPinned,
    created_at,
    visibility,
    nickname,
    isViewed,
    isUpdated,
    views_count,
  } = values;

  return (
    <div className="flex bg-shark-950 rounded-lg w-full px-4 py-2 flex-col gap-y-2">
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between w-full items-center">
          <PostItemHeader
            nickname={nickname}
            isPinned={isPinned}
            visibility={visibility}
            created_at={created_at}
          />
          <PostControl id={id} nickname={nickname} />
        </div>
        <PostItemBody id={id} content={content} nickname={nickname} />
      </div>
      <PostFooter
        isViewed={isViewed}
        id={id}
        views_count={views_count}
        isUpdated={isUpdated}
        nickname={nickname}
      />
      {/*<PostComments id={id} comments_count={comments_count} />*/}
      {/*{isComments && <CreatePostCommentForm id={id} />}*/}
    </div>
  );
};
