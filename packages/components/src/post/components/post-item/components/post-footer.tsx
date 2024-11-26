import { OverridedPosts } from '#profile/components/posts/components/posts/queries/get-posts.ts';
import { Eye } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { HoverCardWrapper } from '#wrappers/hover-card-wrapper.tsx';
import { useEffect, useState } from 'react';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { postPostView } from '#post/components/post-item/queries/post-view.ts';
import { postViewsQuery, PostViewsQuery } from '#post/components/post-item/queries/post-views-query.ts';

type PostFooterProps = Pick<OverridedPosts, 'views_count' | 'isUpdated' | 'id' | "isViewed"> & {
  nickname: string
}

const PostFooterViews = ({
  views_count,
}: Pick<PostFooterProps, 'views_count'>) => {
  return (
    <div className="flex items-center gap-1">
      <Eye size={18} className="text-shark-300" />
      <Typography textSize="small" textColor="gray">{views_count}</Typography>
    </div>
  );
};

type PostFooterWithViewsListProps = Pick<PostViewsQuery, 'postId'>
  & Pick<PostFooterProps, 'views_count'>

const PostFooterWithViewsList = ({
  postId, views_count,
}: PostFooterWithViewsListProps) => {
  const [ enabled, setEnabled ] = useState(false);
  const { data: postViews, isLoading } = postViewsQuery({ postId, enabled, });
  
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
                {/* fix a re-rendering when displaying avatar error */}
                {/*<Avatar*/}
                {/*  nickname={nickname}*/}
                {/*  propHeight={16}*/}
                {/*  propWidth={16}*/}
                {/*/>*/}
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

export const PostFooter = ({
  views_count, isUpdated, nickname, id, isViewed
}: PostFooterProps) => {
  const currentUser = getUser();
  
  useEffect(() => {
    if (!isViewed && currentUser) postPostView(id)
  }, []);
  
  if (!currentUser) return;
  
  const isOwner = nickname === currentUser.nickname;
  
  return (
    <div className="flex w-full gap-4 justify-end items-center">
      {isUpdated && (
        <Typography textSize="small" textColor="gray" className="self-end">
         [изменено]
        </Typography>
      )}
      {isOwner ? <PostFooterWithViewsList postId={id} views_count={views_count} /> : (
        <PostFooterViews views_count={views_count} />
      )}
    </div>
  );
};