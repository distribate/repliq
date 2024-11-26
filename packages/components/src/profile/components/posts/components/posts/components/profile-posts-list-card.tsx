import { OverridedPosts } from '#profile/components/posts/components/posts/queries/get-posts.ts';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import { ProfilePostsListProps } from '#profile/components/posts/components/posts/components/profile-posts-list.tsx';
import { PostItemHeader } from '#post/components/post-item/components/post-header.tsx';
import { PostItemBody } from '#post/components/post-item/components/post-body.tsx';
import { PostFooter } from '#post/components/post-item/components/post-footer.tsx';

type ProfilePostsListCardProps = OverridedPosts & ProfilePostsListProps

export const ProfilePostsListCard = ({
 ...values
}: ProfilePostsListCardProps) => {
  const {
    id, content, isPinned, created_at, visibility, nickname,
    isViewed, isUpdated, views_count
  } = values;
  
  return (
    <BlockWrapper className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-4">
        <PostItemHeader
          id={id}
          nickname={nickname}
          isPinned={isPinned}
          visibility={visibility}
          created_at={created_at}
        />
        <PostItemBody content={content} id={id} />
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
    </BlockWrapper>
  );
};