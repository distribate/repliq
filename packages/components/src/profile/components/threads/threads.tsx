import { UserPageParam } from '@repo/types/config/page-types.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ThreadsList } from './components/threads-list.tsx';

export const UserProfileThreads = ({
  nickname
}: UserPageParam) => {
  
  
  return (
    <div className="flex flex-col w-full gap-6">
      <Separator orientation="horizontal" />
      <ThreadsList nickname={nickname} />
    </div>
  );
};