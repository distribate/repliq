'use client';

import { threadImagesQuery } from './thread-images-query.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { ThreadImageModal } from '#modals/custom/thread-image-modal.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

type ThreadImages = Pick<ThreadEntity, "id">

const ThreadImagesSkeleton = () => {
  return (
    <div className="flex items-start w-full gap-2">
      <Skeleton className="w-[300px] h-[150px]" />
      <Skeleton className="w-[300px] h-[150px]" />
      <Skeleton className="w-[300px] h-[150px]" />
      <Skeleton className="w-[300px] h-[150px]" />
      <Skeleton className="w-[300px] h-[150px]" />
      <Skeleton className="w-[300px] h-[150px]" />
    </div>
  );
};

export const ThreadImages = ({
  id
}: ThreadImages) => {
  const { data: threadImages, isLoading } = threadImagesQuery(id);
  
  if (isLoading) return <ThreadImagesSkeleton />;
  
  if (!threadImages
    || (threadImages && !threadImages.length)
  ) return null;
  
  return (
    <div className="flex items-start w-full gap-2">
      {threadImages.map((image, i) => (
        <ThreadImageModal key={i} image={image} id={id}/>
      ))}
    </div>
  );
};