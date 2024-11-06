'use client';

import { Minus, Plus } from 'lucide-react';
import { Progress } from '@repo/ui/src/components/progress.tsx';
import { threadRatingQuery } from '../queries/thread-rating-query.ts';
import { ThreadRatingSkeleton } from './thread-rating-skeleton.tsx';
import { calculatePercentage } from '@repo/lib/helpers/calculate-percentage.ts';
import { ThreadRatingActionItem } from './thread-rating-action-item.tsx';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

type ThreadRatingProps = {
  threadId: Pick<ThreadEntity, 'id'>["id"]
}

export const ThreadRating = ({
  threadId
}: ThreadRatingProps) => {
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
        className="flex items-center rounded-[8px] bg-shark-900/60 overflow-hidden">
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
      <div className="h-[4px] overflow-hidden w-full rounded-[8px]">
        <Progress
          value={percentRating}
          className={sumRating > 0 ? 'bg-shark-800 *:bg-shark-300' : 'bg-shark-800 '}
        />
      </div>
    </div>
  );
};