'use client';

import { Minus, Plus } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useThreadBump } from '../hooks/use-thread-bump.ts';
import { UpdateThreadRatingType } from '../../../queries/post-thread-rating.ts';
import { Progress } from '@repo/ui/src/components/progress.tsx';
import { threadRatingQuery } from '../queries/thread-rating-query.ts';
import { ThreadRequest } from '../../../types/thread-request-types.ts';
import { ThreadBumpSkeleton } from './thread-bump-skeleton.tsx';

function calculatePercentageRating(
  increment: number, decrement: number,
): number {
  const total = increment + decrement;
  
  if (total === 0) return 0;
  
  return (increment / total) * 100;
}

export const ThreadBump = ({
  thread_id,
}: Pick<ThreadRequest, 'thread_id'>) => {
  const { updateThreadRatingMutation } = useThreadBump();
  const { data: threadRating, isLoading } = threadRatingQuery(thread_id);
  
  if (isLoading) return <ThreadBumpSkeleton/>
  
  if (!thread_id || !threadRating) return null;
  
  const handleThreadBump = (type: UpdateThreadRatingType,) => {
    updateThreadRatingMutation.mutate({
      type: type, thread_id: thread_id,
    });
  };
  
  const percentRating = calculatePercentageRating(
    threadRating.increment, threadRating.decrement,
  );
  
  const sumRating = threadRating.decrement + threadRating.increment
  const currentRatingType = threadRating.currentType;
  
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div
        className="flex items-center overflow-hidden *:transition-all *:cursor-pointer *:ease-in *:items-center *:py-1 *:gap-2 *:duration-150">
        <div
          onClick={() => handleThreadBump('increment')}
          className={`flex px-2 border-[1px] border-emerald-500/50 *:transition-all *:duration-150 rounded-l-md hover:bg-emerald-600 group
           ${currentRatingType === 'increment' && 'bg-emerald-600'}
           ${currentRatingType === 'increment' && 'text-shark-950'}
          `}
        >
          <Plus className="text-shark-50 group-hover:text-shark-950" size={20} />
          <Typography className="text-shark-300 text-sm group-hover:text-shark-950">
            {threadRating.increment}
          </Typography>
        </div>
        <div
          onClick={() => handleThreadBump('decrement')}
          className={`flex px-2 border-l-none rounded-r-md border-r-[1px] *:transition-all *:duration-150 group border-t-[1px]
            border-b-[1px] hover:bg-red-600 border-red-500/50
            ${currentRatingType === 'decrement' && 'bg-red-600'}
            ${currentRatingType === 'decrement' && 'text-shark-950'}
          `}
        >
          <Minus className="text-shark-50 group-hover:text-shark-950" size={20} />
          <Typography className="text-shark-300 group-hover:text-shark-950 text-sm">
            {threadRating.decrement}
          </Typography>
        </div>
      </div>
      <div className="border-white/20 w-full border-[1px] rounded-md">
        <Progress value={percentRating} className={sumRating > 0 ? 'bg-red-600 *:bg-emerald-600' : ''} />
      </div>
    </div>
  );
};