import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import {
  threadCommentsAction,
  threadCommentsDataAtom,
  threadCommentsMetaAtom,
} from '../models/thread-comments.model.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { useInView } from 'react-intersection-observer';
import { ThreadDetailed } from '@repo/types/entities/thread-type.ts';
import { updateCommentsAction } from '../models/update-comments.model.ts';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent, useUpdate } from '@reatom/npm-react';
import { onConnect } from '@reatom/framework';
import { threadAtom, threadOwnerAtom, threadParamAtom } from '#components/thread/thread-main/models/thread.model.ts';
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model.ts';
import { ThreadCommentsHeader } from './thread-comments-header.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { lazy, Suspense } from 'react';
import { ThreadCommentsAnchor } from './thread-comments-anchor.tsx';
import { CreateThreadComment } from '#components/thread/create-thread-comment/components/create-thread-comment.tsx';
import { isAuthenticatedAtom } from '#components/auth/models/auth.model.ts';

type ThreadCommentsProps = Pick<ThreadDetailed, "properties" | "owner">

const CommentsDisabled = lazy(() => import("#components/thread/thread-comments/components/comments-disabled.tsx").then(m => ({ default: m.CommentsDisabled })))

onConnect(threadCommentsDataAtom, threadCommentsAction)

const SyncInView = ({ inView }: { inView: boolean }) => {
  useUpdate((ctx) => {
    if (!inView) return;

    const threadId = ctx.get(threadParamAtom)
    if (!threadId) return;

    const meta = ctx.get(threadCommentsMetaAtom)
    const hasMore = meta?.hasNextPage
    if (!hasMore) return;

    const cursor = meta?.endCursor

    updateCommentsAction(ctx, { cursor, threadId })
  }, [inView])

  return null;
}

export const ThreadComments = reatomComponent<ThreadCommentsProps>(({ ctx, owner }) => {
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });
  const threadId = ctx.spy(threadParamAtom)
  const data = ctx.spy(threadCommentsDataAtom)
  const meta = ctx.spy(threadCommentsMetaAtom)
  const hasMore = meta?.hasNextPage;

  if (ctx.spy(threadCommentsAction.statusesAtom).isPending) {
    return <SectionSkeleton />;
  }

  if (!threadId) return null;

  return (
    <>
      <SyncInView inView={inView} />
      <div className="flex flex-col items-center relative w-full">
        {data && (
          <div className="flex flex-col items-start gap-y-2 w-full">
            {data.map((comment, idx) => (
              <ThreadCommentItem
                key={comment.id}
                idx={idx + 1}
                threadId={threadId}
                id={comment.id}
                replied={comment.replied}
                is_updated={comment.is_updated}
                user={comment.user}
                content={comment.content}
                isOwner={comment.user.nickname === owner.nickname}
                created_at={comment.created_at}
                updated_at={comment.updated_at}
              />
            ))}
            {ctx.spy(updateCommentsAction.statusesAtom).isPending && (
              <div className="flex flex-col items-start gap-y-2 w-full">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            )}
            {hasMore && <div ref={ref} className="h-[1px] w-full" />}
          </div>
        )}
      </div>
    </>
  )
}, "ThreadComments")

const ANCHOR_MIN_COMMENTS_LENGTH = 8

export const ThreadCommentsSection = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)
  if (!isAuthenticated) return null;

  const can_create_comments = ctx.spy(userGlobalOptionsAtom).can_create_comments
  const thread = ctx.spy(threadAtom)
  const threadOwner = ctx.spy(threadOwnerAtom)

  if (!thread || !threadOwner) return null;

  return (
    <div className="flex flex-col w-full h-full mt-4 gap-y-4">
      {thread.properties.is_comments ? (
        <>
          <ThreadCommentsHeader non_comments={!thread.properties.is_comments} />
          {can_create_comments ? (
            <CreateThreadComment />
          ) : (
            <Typography className="text-red-500 text-base">
              Вы были наказаны и теперь не сможете оставлять комментарии!
            </Typography>
          )}
        </>
      ) : (
        <Suspense>
          <CommentsDisabled />
        </Suspense>
      )}
      <ThreadComments owner={threadOwner} properties={thread.properties} />
      {thread.comments_count >= ANCHOR_MIN_COMMENTS_LENGTH && <ThreadCommentsAnchor />}
    </div>
  )
}, "ThreadCommentsSection")