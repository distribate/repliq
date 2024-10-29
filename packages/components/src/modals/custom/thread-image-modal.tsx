import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

type ThreadImageModal = Pick<ThreadEntity, 'id'> & {
  image: string,
}

export const ThreadImageModal = ({
  id: threadId, image,
}: ThreadImageModal) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="relative flex justify-center items-start w-[300px] group h-[180px] overflow-hidden object-cover rounded-md">
          <ImageWrapper
            propSrc={image}
            propAlt={`image `}
            width={600}
            className="object-cover w-full h-fit rounded-md group-hover:brightness-50"
            height={400}
            loading="lazy"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <ImageWrapper
          propSrc={image}
          propAlt={`image `}
          width={1920}
          className="object-cover"
          height={1080}
          loading="lazy"
        />
      </DialogContent>
    </Dialog>
  );
};