import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { DeleteButton } from '@repo/ui/src/components/detele-button.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

type FormPreviewImageModalProps = {
  image: string,
  handleDeleteImage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  propAlt?: string
}

export const FormPreviewImageModal = ({
  handleDeleteImage, image, propAlt,
}: FormPreviewImageModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative w-fit group overflow-hidden">
          <DeleteButton onClick={handleDeleteImage} variant="invisible" />
          <ImageWrapper
            propSrc={image}
            propAlt={propAlt || ''}
            width={1200}
            height={1200}
            className="max-w-[140px] h-fit rounded-md"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <ImageWrapper
          propSrc={image}
          propAlt={propAlt || 'Preview Image'}
          width={1920}
          height={1080}
          className="w-full h-full"
        />
      </DialogContent>
    </Dialog>
  );
};