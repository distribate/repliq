import { useState } from 'react';
import { PostViewsQuery, postViewsQuery } from '#post/components/post-item/queries/post-views-query.ts';
import { HoverCardWrapper } from '#wrappers/hover-card-wrapper.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { OverridedPosts } from '#profile/components/posts/components/posts/queries/get-posts.ts';
import { PostFooterViews } from '#post/components/post-item/components/post-footer-views.tsx';

type PostFooterWithViewsListProps = Pick<PostViewsQuery, 'id'>
  & Pick<OverridedPosts, 'views_count'>

export const PostFooterWithViewsList = ({
  id, views_count,
}: PostFooterWithViewsListProps) => {
  const [ enabled, setEnabled ] = useState<boolean>(false);
  const { data: postViews, isLoading } = postViewsQuery({ id, enabled });
  
  return (
    <HoverCardWrapper
      trigger={
        <div onMouseEnter={() => setEnabled(true)}>
          <PostFooterViews views_count={views_count} />
        </div>
      }
      content={
        <div className="flex flex-col gap-1 w-full">
          {isLoading && (
            <>
              <Skeleton className="h-6 w-full"/>
              <Skeleton className="h-6 w-full"/>
            </>
          )}
          {(!isLoading && postViews) && postViews.map(({ nickname, created_at }) => (
            <div key={nickname} className="flex h-6 items-center gap-2 w-full">
              <div className="flex items-center gap-2 justify-between">
                <UserNickname nickname={nickname} className="text-[14px]" />
              </div>
              <Typography textSize="small">{dayjs(created_at).fromNow()}</Typography>
            </div>
          ))}
        </div>
      }
    />
  );
};
