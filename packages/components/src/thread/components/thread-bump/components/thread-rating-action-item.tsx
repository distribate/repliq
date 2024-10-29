import { UpdateThreadRatingType } from '../../../queries/post-thread-rating.ts';
import { useThreadRating } from '../hooks/use-thread-rating.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';

type RatingActionItemProps = {
  ratingType: UpdateThreadRatingType,
  icon: any,
  ratingValue: number,
  threadId: string,
  currentRatingType: UpdateThreadRatingType
}

export const ThreadRatingActionItem = ({
  ratingType, icon: Icon, ratingValue, threadId, currentRatingType
}: RatingActionItemProps) => {
  const { updateThreadRatingMutation } = useThreadRating();
  const isValue = (type: UpdateThreadRatingType) => currentRatingType === type;
  
  const handleThreadBump = (type: UpdateThreadRatingType) => {
    updateThreadRatingMutation.mutate({ type, threadId, });
  };
  
  return (
    <div
      onClick={() => handleThreadBump(ratingType)}
      className={`${isValue(ratingType) ? 'bg-white/10' : ''}
      flex items-center gap-1 py-1 px-4 *:transition-all *:duration-150 group cursor-pointer`}
    >
      <Icon className="text-shark-300" size={20} />
      <Typography className="text-shark-50">
        {ratingValue}
      </Typography>
    </div>
  );
}