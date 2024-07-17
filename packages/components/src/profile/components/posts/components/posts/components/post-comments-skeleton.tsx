import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { BlockWrapper } from '../../../../../../wrappers/block-wrapper.tsx';

const PostCommentSkeleton = () => {
  return (
    <div className="flex flex-row gap-2 group items-end justify-between w-full">
      <Skeleton className="h-[36px] w-[36px]" />
      <BlockWrapper className="flex-col gap-y-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col w-fit grow">
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
        <div className="flex w-full mb-4">
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </BlockWrapper>
    </div>
  );
};

export const PostCommentsSkeleton = () => {
  return (
    <>
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <PostCommentSkeleton />
        <PostCommentSkeleton />
      </div>
    </>
  );
};