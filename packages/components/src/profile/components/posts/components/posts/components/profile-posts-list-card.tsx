import { PostsByUser } from '#profile/components/posts/components/posts/queries/get-posts-by-user.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import React from 'react';
import { ProfilePostsListProps } from '#profile/components/posts/components/posts/components/profile-posts-list.tsx';
import { PostComments } from '#post/components/post-comments/components/post-comments.tsx';
import { PostItemHeader } from '#post/components/post-item/components/post-header.tsx';
import { PostItemBody } from '#post/components/post-item/components/post-body.tsx';
import { PostItemFooter } from '#post/components/post-item/components/post-footer.tsx';

type ProfilePostsListCardProps = PostsByUser & ProfilePostsListProps

export const ProfilePostsListCard = ({
  id, commentsCount, isComments, created_at, visibility, content, nickname,
}: ProfilePostsListCardProps) => {
  const currentUser = getUser();
  
  return (
    <BlockWrapper className="flex flex-col gap-y-4">
      <PostItemHeader
        id={id}
        visibility={visibility}
        nickname={nickname}
        created_at={created_at}
      />
      <PostItemBody content={content} />
      <PostComments id={id} commentsCount={commentsCount} />
      {currentUser && <PostItemFooter id={id} />}
    </BlockWrapper>
  );
};