import { Metadata } from 'next';
import { MetadataType, PageConventionProps } from '@repo/types/config/page-types.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
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

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { id: thread_id } = params;
  
  let threadTitle: string = '';
  if (!thread_id) threadTitle = '';
  
  const title = await getTopicName(thread_id);
  if (title) threadTitle = title.title;
  
  return { title: threadTitle };
}

export default async function TopicsTopicPage({ params }: PageConventionProps) {
  const { id } = params;
  
  const qc = new QueryClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser || !id) return null;
  
  const thread = await getThreadModel({
    threadId: id, type: 'all',
  });
  
  if (!thread || !thread.nickname) return null;
  
  await qc.prefetchQuery({
    queryKey: THREAD_COMMENTS_QUERY_KEY(thread.id),
    queryFn: () => getThreadComments({
      thread_id: thread.id, comments: thread.comments,
    }),
  });
  
  const isThreadCreator = currentUser.nickname === thread.nickname;
  
  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <div className="flex flex-col w-3/4 items-start h-full gap-y-4 justify-start">
        <BlockWrapper>
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            {thread.content && (
              <div className="flex flex-col gap-y-4 w-full h-full">
                {thread.description && (
                  <>
                    <Typography textSize="medium" textColor="shark_white">
                      {thread.description}
                    </Typography>
                    <Separator />
                  </>
                )}
                <ThreadContent content={thread.content} />
                {thread.images && <ThreadImages id={thread.id} />}
              </div>
            )}
          </Suspense>
        </BlockWrapper>
        <Separator />
        <div className="flex flex-col w-full h-full gap-y-4 overflow-hidden">
          <HydrationBoundary state={dehydrate(qc)}>
            <ThreadComments
              thread_author_nickname={thread.nickname}
              thread_id={thread.id}
              thread_comments={thread.comments}
            />
          </HydrationBoundary>
          <CreateThreadComment thread_id={thread.id} />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-1/4 h-fit sticky top-0 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-4">
          <ThreadInfo {...thread} />
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
          <div className="flex flex-col border border-shark-700 rounded-lg bg-shark-950 w-full px-0 py-2 gap-y-4">
            <div className="flex flex-col gap-y-4 py-2 w-full">
              <Typography
                textSize="big"
                className="font-semibold px-4"
                textColor="shark_white"
              >
                Управление тредом
              </Typography>
              <ThreadControl threadId={thread.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}