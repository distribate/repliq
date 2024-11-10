import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

type ThreadImageModal = {
  image: string
}

export const ThreadImageModal = ({
  image
}: ThreadImageModal) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex justify-center group items-start w-[300px] h-[180px] overflow-hidden object-cover">
          <ImageWrapper
            propSrc={image}
            propAlt=""
            width={600}
            className="object-cover w-full h-fit rounded-md group-hover:brightness-50"
            height={400}
            loading="lazy"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-2xl">
        <ImageWrapper
          propSrc={image}
          propAlt=""
          width={1920}
          className="object-cover"
          height={1080}
          loading="lazy"
        />
      </DialogContent>
    </Dialog>
  );
};