'use client';

import { Minus, Plus } from 'lucide-react';
import { Progress } from '@repo/ui/src/components/progress.tsx';
import { threadRatingQuery } from '../queries/thread-rating-query.ts';
import { ThreadRequest } from '../../../types/thread-request-types.ts';
import { ThreadRatingSkeleton } from './thread-rating-skeleton.tsx';
import { calculatePercentage } from '@repo/lib/helpers/calculate-percentage.ts';
import { ThreadRatingActionItem } from './thread-rating-action-item.tsx';

export const ThreadRating = ({
  thread_id: threadId,
}: Pick<ThreadRequest, 'thread_id'>) => {
  const { data: threadRating, isLoading } = threadRatingQuery(threadId);
  
  if (isLoading) return <ThreadRatingSkeleton />;
  
  if (!threadId || !threadRating) return null;
  
  const percentRating = calculatePercentage(
    {
      firstValue: threadRating.increment,
      secondValue: threadRating.decrement
    }
  );
  
  const sumRating = threadRating.decrement + threadRating.increment;

  return (
    <div className="flex flex-col items-center w-fit gap-1">
      <div
        className="flex items-center rounded-md border-shark-700 border bg-shark-900/60 overflow-hidden">
        <ThreadRatingActionItem
          currentRatingType={threadRating.currentType}
          threadId={threadId}
          ratingType="increment"
          ratingValue={threadRating.increment}
          icon={Plus}
        />
        <ThreadRatingActionItem
          currentRatingType={threadRating.currentType}
          threadId={threadId}
          ratingType="decrement"
          ratingValue={threadRating.decrement}
          icon={Minus}
        />
      </div>
      <div className="h-[4px] overflow-hidden w-full rounded-md">
        <Progress
          value={percentRating}
          className={sumRating > 0 ? 'bg-shark-900 *:bg-shark-300' : ''}
        />
      </div>
    </div>
  );
};