import { Metadata } from 'next';
import { getTopicName } from '@repo/lib/queries/get-thread-name.ts';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import { ThreadControl } from '@repo/components/src/thread/components/thread-control/components/thread-control.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadContent } from '@repo/components/src/thread/components/thread-content/components/thread-content.tsx';
import { ThreadComments } from '@repo/components/src/thread/components/thread-comments/components/thread-comments.tsx';
import { ThreadImages } from '@repo/components/src/thread/components/thread-images/thread-images.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { getThreadModel } from '@repo/components/src/thread/queries/get-thread-model.ts';
import { ThreadRating } from '@repo/components/src/thread/components/thread-bump/components/thread-rating.tsx';
import { ThreadShare } from '@repo/components/src/thread/components/thread-share/thread-share.tsx';
import { ThreadSave } from '@repo/components/src/thread/components/thread-save/thread-save.tsx';
import {
  CreateThreadComment,
} from '@repo/components/src/thread/components/create-thread-comment/components/create-thread-comment.tsx';
import { ContentNotFound } from '@repo/components/src/templates/section-not-found.tsx';
import { MetadataType, PageConventionProps } from '@repo/types/global';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadMore } from '@repo/components/src/thread/components/thread-more/components/thread-more.tsx';
import { Eye } from 'lucide-react';
import { FriendButton } from '@repo/components/src/buttons/friends/friend-button.tsx';
import { Descendant } from 'slate';
import { CommentsDisabled } from '@repo/components/src/templates/comments-disabled.tsx';
import { redirect } from 'next/navigation';
import { ThreadCreator } from '@repo/components/src/thread/components/thread-creator/components/thread-creator.tsx';
import { Suspense } from 'react';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import dayjsInstance from '@repo/lib/utils/dayjs/dayjs-instance.ts';

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { id: thread_id } = params;
  let title: string = 'Не найдено';
  if (!thread_id) title = '';
  const data = await getTopicName(thread_id);
  if (data) title = data.title;
  return { title };
}

export default async function TopicsTopicPage({
  params,
}: PageConventionProps) {
  const { id: threadId } = params;
  const currentUser = await getCurrentUser();
  if (!currentUser || !threadId) return redirect('/');
  
  const thread = await getThreadModel({ id: threadId, postViews: true });
  
  if (!thread) return <ContentNotFound title="Тред не найден. Возможно он уже удален" />;
  
  const isThreadCreator = currentUser.nickname === thread.owner.nickname;
  
  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <div className="flex flex-col min-w-3/4 w-3/4 max-w-3/4 items-start h-full justify-start">
        <div className="flex flex-col gap-6 rounded-lg w-full py-6 bg-shark-950">
          <div className="flex flex-col w-fit px-4">
            <Typography textSize="very_big" className="font-semibold" textColor="shark_white">
              {thread.title}
            </Typography>
            <Typography textColor="gray">
              тема создана <span className="text-caribbean-green-400">{dayjsInstance(thread.created_at).fromNow()}</span> в категории ...
            </Typography>
          </div>
          {thread.content && (
            <ThreadContent
              id={thread.id}
              content={thread.content as Descendant[]}
              isOwner={isThreadCreator}
            />
          )}
          {thread.isImages && <ThreadImages id={thread.id} />}
          <div className="flex items-center justify-end w-full gap-3 px-4">
            <div className="flex items-center w-fit gap-1">
              <Eye size={18} className="text-shark-300" />
              <Typography textSize="small" textColor="gray">
                {thread.views}
              </Typography>
            </div>
            {thread.isUpdated && (
              <div className="flex items-center w-fit gap-1">
                <Typography textSize="small" textColor="gray">
                  изменено в {thread.updated_at || 0}
                </Typography>
              </div>
            )}
          </div>
        </div>
        <BlockWrapper padding="without" className="mt-4">
          <ThreadMore
            description={thread.description}
            tags={thread.tags}
            created_at={thread.created_at}
            owner={thread.owner}
          />
        </BlockWrapper>
        <div className="flex flex-col w-full h-full mt-2 gap-y-4">
          <ThreadComments
            threadAuthorNickname={thread.owner.nickname}
            thread_id={thread.id}
            isComments={thread.isComments}
          />
          {thread.isComments ? <CreateThreadComment /> : <CommentsDisabled />}
        </div>
      </div>
      <div className="flex flex-col gap-y-4 min-w-1/4 w-1/4 max-w-1/4 h-fit sticky top-0 overflow-hidden">
        <BlockWrapper>
          <div className="flex items-center justify-between w-full">
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <ThreadCreator owner={thread.owner} />
            </Suspense>
            {isThreadCreator ? (
              <Button state="default" className="px-4">
                <Typography>Это вы</Typography>
              </Button>
            ) : <FriendButton reqUserNickname={thread.owner.nickname} />}
          </div>
        </BlockWrapper>
        <BlockWrapper>
          <div className="flex justify-between items-center w-full">
            <Suspense fallback={<Skeleton className="h-16 w-full" />}>
              {thread.rating && <ThreadRating threadId={thread.id} />}
            </Suspense>
            <div className="flex gap-2 items-center h-full">
              <ThreadShare />
              <ThreadSave />
            </div>
          </div>
        </BlockWrapper>
        {isThreadCreator && <ThreadControl id={thread.id} />}
      </div>
    </div>
  );
}