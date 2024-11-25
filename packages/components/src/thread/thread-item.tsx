import { getThreadModel, ThreadModel } from './queries/get-thread-model.ts';
import { ThreadByCategoryItem } from './components/thread-card-category/thread-by-category-item.tsx';
import { ThreadLayout } from './components/thread-layout/thread-layout.tsx';

export const ThreadItem = async({
  id: threadId,
}: Pick<ThreadModel, 'id'>) => {
  const thread = await getThreadModel({ id: threadId });
  if (!thread) return null;
  
  return (
    <ThreadLayout id={threadId} title={thread.title} owner={thread.owner}>
      <ThreadByCategoryItem {...thread} />
    </ThreadLayout>
  );
};