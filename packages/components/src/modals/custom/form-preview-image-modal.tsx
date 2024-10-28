import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { DeleteButton } from '@repo/ui/src/components/detele-button.tsx';

export const FORM_PREVIEW_IMAGE_MODAL = (target: string) => `FORM_PREVIEW_IMAGE_${target}`;

type FormPreviewImageModalProps = {
  modalTarget: string,
  image: string,
  handleDeleteImage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  propAlt?: string
}

export const FormPreviewImageModal = ({
  handleDeleteImage, image, propAlt, modalTarget,
}: FormPreviewImageModalProps) => {
  return (
    <DialogWrapper
      properties={{
        dialogContentClassName: "!p-0 max-w-2xl max-h-xl"
      }}
      name={FORM_PREVIEW_IMAGE_MODAL(modalTarget)}
      trigger={
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
      }
    >
      <ImageWrapper
        propSrc={image}
        propAlt={propAlt || 'Preview Image'}
        width={1920}
        height={1080}
        className="w-full h-full"
      />
    </DialogWrapper>
  );
};