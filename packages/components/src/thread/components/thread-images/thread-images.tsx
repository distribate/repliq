'use client';

import { ImageWrapper } from '../../../wrappers/image-wrapper.tsx';
import { View } from 'lucide-react';
import { threadImagesQuery } from './thread-images-query.ts';
import { DialogWrapper } from '../../../wrappers/dialog-wrapper.tsx';
import { ThreadImagesSkeleton } from './thread-images-skeleton.tsx';

type ThreadImages = {
  thread_id: string
}

export const ThreadImages = ({
  thread_id,
}: ThreadImages) => {
  const { data: threadImages, isLoading } = threadImagesQuery(thread_id);
  
  if (isLoading) return <ThreadImagesSkeleton />;
  if (threadImages && !threadImages.length) return null;
  
  return (
    <div className="flex items-start w-full gap-2">
      {threadImages?.map((image, i) => (
        <DialogWrapper
          key={i}
          name={`Thread ${thread_id} image ${i}`}
          trigger={
            <div className="relative flex justify-center items-center w-[300px] group h-[150px] overflow-hidden object-cover rounded-md">
              <div className="items-center bg-black/60 justify-center hidden group-hover:flex absolute top-0 right-0 left-0 bottom-0">
                <View size={26} className="text-shark-300" />
              </div>
              <ImageWrapper
                propSrc={image}
                propAlt={`image `}
                width={600}
                className="object-cover"
                height={400}
                loading="lazy"
              />
            </div>
          }
        >
          <ImageWrapper
            propSrc={image}
            propAlt={`image `}
            width={1280}
            className="object-cover"
            height={720}
            loading="lazy"
          />
        </DialogWrapper>
      ))}
    </div>
  );
};