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
import { threadParamAtom } from '#components/thread/thread-main/models/thread.model.ts';

type ThreadCommentsProps = Pick<ThreadDetailed, "properties" | "owner">

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
                content={comment.content}
                user_nickname={comment.user_nickname}
                isOwner={comment.user_nickname === owner.nickname}
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