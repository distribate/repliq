import { getThreadModel, ThreadModel } from './queries/get-thread-model.ts';
import { ThreadByCategoryItem } from './components/thread-card-category/thread-by-category-item.tsx';
import { ThreadLayout } from './components/thread-layout/thread-layout.tsx';

export const ThreadItem = async({
  id,
}: Pick<ThreadModel, 'id'>) => {
  const thread = await getThreadModel({
    type: 'all', threadId: id,
  });
  
  if (!thread) return null;
  
  const { nickname, title } = thread;
  
  if (!nickname) return;
  
  return (
    <ThreadLayout id={id} title={title} nickname={nickname}>
      <ThreadByCategoryItem {...thread} />
    </ThreadLayout>
  );
};