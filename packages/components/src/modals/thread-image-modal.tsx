import { View } from 'lucide-react';
import { ImageWrapper } from '../wrappers/image-wrapper.tsx';
import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import { THREAD } from '@repo/types/entities/entities-type.ts';

export const THREAD_IMAGE_MODAL_NAME = (threadId: string, index: number) => `thread-image-${threadId}-${index}`

type ThreadImageModal = Pick<THREAD, "id"> & {
  image: string,
  index: number
}

export const ThreadImageModal = ({
  id: threadId, image, index
}: ThreadImageModal) => {
  return (
    <DialogWrapper
      name={THREAD_IMAGE_MODAL_NAME(threadId, index)}
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
  )
}