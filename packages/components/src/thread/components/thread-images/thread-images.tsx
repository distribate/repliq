'use client';

import { threadImagesQuery } from './thread-images-query.ts';
import { ThreadImagesSkeleton } from './thread-images-skeleton.tsx';
import { THREAD } from '@repo/types/entities/entities-type.ts';
import { ThreadImageModal } from '../../../modals/custom/thread-image-modal.tsx';

type ThreadImages = Pick<THREAD, "id">

export const ThreadImages = ({
  id: threadId
}: ThreadImages) => {
  const { data: threadImages, isLoading } = threadImagesQuery(threadId);
  
  if (isLoading) return <ThreadImagesSkeleton />;
  if (threadImages && !threadImages.length) return null;
  
  return (
    <div className="flex items-start w-full gap-2">
      {threadImages?.map((image, i) => (
        <ThreadImageModal key={i} image={image} index={i} id={threadId}/>
      ))}
    </div>
  );
};