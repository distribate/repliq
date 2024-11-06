import { Metadata } from 'next';
import { getTopicName } from '@repo/lib/queries/get-thread-name.ts';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import { ThreadControl } from '@repo/components/src/thread/components/thread-control/components/thread-control.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadContent } from '@repo/components/src/thread/components/thread-content/components/thread-content.tsx';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ThreadInfo } from '@repo/components/src/thread/components/thread-info/components/thread-info.tsx';
import {
  THREAD_COMMENTS_QUERY_KEY,
} from '@repo/components/src/thread/components/thread-comments/queries/thread-comments-query.ts';
import {
  getThreadComments,
} from '@repo/components/src/thread/components/thread-comments/queries/get-thread-comments.ts';
import { ThreadComments } from '@repo/components/src/thread/components/thread-comments/components/thread-comments.tsx';
import { ThreadImages } from '@repo/components/src/thread/components/thread-images/thread-images.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { getThreadModel } from '@repo/components/src/thread/queries/get-thread-model.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ThreadRating } from '@repo/components/src/thread/components/thread-bump/components/thread-rating.tsx';
import { ThreadShare } from '@repo/components/src/thread/components/thread-share/thread-share.tsx';
import { ThreadSave } from '@repo/components/src/thread/components/thread-save/thread-save.tsx';
import {
  CreateThreadComment,
} from '@repo/components/src/thread/components/create-thread-comment/components/create-thread-comment.tsx';
import { ContentNotFound } from '@repo/components/src/templates/section-not-found.tsx';
import { MetadataType, PageConventionProps } from '@repo/types/global';
import { Avatar } from '@repo/components/src/user/components/avatar/components/avatar.tsx';
import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { UserNickname } from '@repo/components/src/user/components/name/components/nickname.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadMore } from '@repo/components/src/thread/components/thread-more/components/thread-more.tsx';
import { Eye } from 'lucide-react';
import { FriendButton } from '@repo/components/src/buttons/friends/friend-button.tsx';

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { id: thread_id } = params;
  
  let threadTitle: string = 'Не найдено';
  if (!thread_id) threadTitle = '';
  
  const title = await getTopicName(thread_id);
  if (title) threadTitle = title.title;
  
  return { title: threadTitle };
}

export default async function TopicsTopicPage({
  params,
}: PageConventionProps) {
  const { id } = params;
  const currentUser = await getCurrentUser();
  
  if (!currentUser || !id) return null;
  
  const thread = await getThreadModel({
    threadId: id, withViews: true
  });
  
  if (!thread || !thread.owner) {
    return <ContentNotFound title="Тред не найден. Возможно он уже удален" />;
  }
  
  const qc = new QueryClient();
  
  await qc.prefetchQuery({
    queryKey: THREAD_COMMENTS_QUERY_KEY(thread.id),
    queryFn: () => getThreadComments(thread.id)
  });
  
  const isThreadCreator = currentUser.nickname === thread.owner.nickname;
  
  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <div className="flex flex-col w-3/4 items-start h-full gap-y-4 justify-start">
        <BlockWrapper>
          <Suspense fallback={<Skeleton className="h-56 w-full" />}>
            {thread.content && (
              <div className="flex flex-col py-4 gap-y-6 w-full h-full">
                <Typography textSize="big" className="font-semibold" textColor="shark_white">
                  {thread.title}
                </Typography>
                <ThreadContent content={thread.content} />
                {thread.images && <ThreadImages id={thread.id} />}
              </div>
            )}
            <div className="flex items-center mt-2 w-fit gap-1 self-end">
              <Eye size={18} className="text-shark-300"/>
              <Typography textSize="small" textColor="gray">
                {thread.views}
              </Typography>
            </div>
          </Suspense>
        </BlockWrapper>
        <BlockWrapper padding="without">
          <ThreadMore
            description={thread.description}
            tags={thread.tags}
            created_at={thread.created_at}
            owner={thread.owner}
          />
        </BlockWrapper>
        <div className="flex flex-col w-full h-full gap-y-4">
          {thread.comments ? (
            <>
              <HydrationBoundary state={dehydrate(qc)}>
                <ThreadComments
                  threadAuthorNickname={thread.owner.nickname}
                  thread_id={thread.id}
                  comments={thread.comments}
                />
              </HydrationBoundary>
              <CreateThreadComment />
            </>
          ) : (
            <div className="flex w-fit self-center bg-shark-700 rounded-md px-2 py-0.5 mb-2">
              <Typography textSize="medium" textColor="shark_white" className="font-semibold">
                Комментирование отключено
              </Typography>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-1/4 h-fit sticky top-0 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-4">
          <ThreadInfo {...thread} />
        </BlockWrapper>
        <BlockWrapper>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 w-full">
              <Link href={USER_URL + thread.owner.nickname}>
                <Avatar nickname={thread.owner.nickname} propWidth={36} propHeight={36} />
              </Link>
              <div className="flex flex-col w-fit">
                <Link href={USER_URL + thread.owner.nickname}>
                  <UserNickname nickname={thread.owner.nickname} />
                </Link>
                <Typography textSize="small" textColor="gray">
                  2 треда
                </Typography>
              </div>
            </div>
            {isThreadCreator && (
              <Button state="default">
                <Typography>
                  Это вы
                </Typography>
              </Button>
            )}
            {!isThreadCreator && (
              <FriendButton reqUserNickname={thread.owner.nickname} />
            )}
          </div>
        </BlockWrapper>
        <BlockWrapper>
          <div className="flex justify-between items-center w-full">
            {thread.rating && <ThreadRating thread_id={thread.id} />}
            <div className="flex gap-2 items-center h-full">
              <ThreadShare />
              <ThreadSave />
            </div>
          </div>
        </BlockWrapper>
        {isThreadCreator && (
          <div className="flex flex-col rounded-lg bg-shark-950 w-full px-0 py-2 gap-y-4">
            <div className="flex flex-col gap-y-4 py-2 w-full">
              <Typography textSize="big" className="font-semibold px-4" textColor="shark_white">
                Управление тредом
              </Typography>
              <ThreadControl id={thread.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}