'use client';

import { Minus, Plus } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useThreadBump } from '../hooks/use-thread-bump.ts';
import { UpdateThreadRatingType } from '../../../queries/post-thread-rating.ts';
import { Progress } from '@repo/ui/src/components/progress.tsx';
import { threadRatingQuery } from '../queries/thread-rating-query.ts';
import { ThreadRequest } from '../../../types/thread-request-types.ts';
import { ThreadBumpSkeleton } from './thread-bump-skeleton.tsx';
import { TooltipWrapper } from '../../../../wrappers/tooltip-wrapper.tsx';

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
  
  if (isLoading) return <ThreadBumpSkeleton />;
  
  if (!thread_id || !threadRating) return null;
  
  const handleThreadBump = (type: UpdateThreadRatingType) => {
    updateThreadRatingMutation.mutate({
      type: type, threadId: thread_id,
    });
  };
  
  const percentRating = calculatePercentageRating(
    threadRating.increment, threadRating.decrement,
  );
  
  const sumRating = threadRating.decrement + threadRating.increment;
  const isValue = (type: UpdateThreadRatingType) => threadRating.currentType === type;
  
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div
        className="flex items-center rounded-md bg-shark-900/60 overflow-hidden">
        <TooltipWrapper
          properties={{ sideAlign: "top", contentAlignOffset: -4 }}
          trigger={
            <div
              onClick={() => handleThreadBump('increment')}
              className={`${isValue('increment') ? 'bg-white/10' : ''} flex items-center gap-2 py-1 px-2 *:transition-all *:duration-150 group`}
            >
              <Plus className={isValue('increment') ? 'text-emerald-500' : 'text-shark-50'} size={20} />
              <Typography className="text-shark-50">
                {threadRating.increment}
              </Typography>
            </div>
          }
          content={
            <Typography>Мне нравится это</Typography>
          }
        />
        <TooltipWrapper
          trigger={
            <div
              onClick={() => handleThreadBump('decrement')}
              className={`${isValue('decrement') ? 'bg-white/10' : ''} flex items-center gap-2 py-1 px-2 *:transition-all *:duration-150 group`}
            >
              <Minus className={isValue('decrement') ? 'text-red-500' : 'text-shark-50'} size={20} />
              <Typography className="text-shark-50">
                {threadRating.decrement}
              </Typography>
            </div>
          }
          content={
            <Typography>Мне не нравится это</Typography>
          }
        />
      </div>
      <div className="border-white/20 w-full border-[1px] rounded-md">
        <Progress value={percentRating} className={sumRating > 0 ? 'bg-red-600 *:bg-emerald-600' : ''} />
      </div>
    </div>
  );
};