import { updateCommentsAction } from '#components/thread/thread-comments/models/update-comments.model';
import { threadAtom } from '#components/thread/models/thread.model';
import { threadCommentsDataAtom, threadCommentsMetaAtom } from '#components/thread/thread-comments/models/thread-comments.model';
import { action, atom, batch } from '@reatom/core';
import { sleep } from '@reatom/framework';

interface UseScrollToCommentProps {
  threadId: string;
  repliedId: number;
}

export const selectedCommentAtom = atom<number | null>(null, 'selectedComment');
export const highlightActiveAtom = atom<boolean>(false, 'highlightActive');

export const selectCommentAction = action(async (ctx, commentId: number) => {
  batch(ctx, () => {
    highlightActiveAtom(ctx, true)
    selectedCommentAtom(ctx, commentId)
  })

  await sleep(2000)

  batch(ctx, () => {
    highlightActiveAtom(ctx, false)
    selectedCommentAtom(ctx, null)
  })
}, 'selectCommentAction')

export const scrollToCommentAction = action(async (ctx, values: UseScrollToCommentProps) => {
  const thread = ctx.get(threadAtom)
  const threadComments = ctx.get(threadCommentsDataAtom)
  const threadCommentsMeta = ctx.get(threadCommentsMetaAtom)

  if (!threadComments || !thread) return;

  const { repliedId, threadId } = values;

  const totalThreadCommentsLength = thread.comments_count;

  let commentIndex = threadComments.findIndex(comment => comment.id === repliedId);

  while (commentIndex === -1 && threadComments.length < totalThreadCommentsLength) {
    const cursor = threadCommentsMeta?.endCursor

    if (!cursor) break;

    try {
      await updateCommentsAction(ctx)

      commentIndex = threadComments.findIndex(comment => comment.id === repliedId);
    } catch (error) {
      break;
    }
  }

  if (commentIndex === -1) {
    return;
  }

  setTimeout(() => {
    const id = (commentIndex + 1).toString();
    const repliedElement = document.getElementById(id);

    selectCommentAction(ctx, values.repliedId)

    if (repliedElement) {
      repliedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
})