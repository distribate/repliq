import { X } from 'lucide-react';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';

export const FORM_PREVIEW_IMAGE_MODAL = (target: string) => `FORM_PREVIEW_IMAGE_${target}`;

type FormPreviewImageModalProps = {
  modalTarget: string,
  image: string,
  handleDeleteImage: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  propAlt?: string
}

export const FormPreviewImageModal = ({
  handleDeleteImage, image, propAlt, modalTarget
}: FormPreviewImageModalProps) => {
  return (
    <DialogWrapper
      name={FORM_PREVIEW_IMAGE_MODAL(modalTarget)}
      trigger={
        <div className="relative max-h-[160px] max-w-[320px] overflow-hidden rounded-md">
          <div className="absolute right-2 top-2">
            <X
              size={18}
              className="text-shark-300 hover:text-red-600"
              onClick={handleDeleteImage}
            />
          </div>
          <ImageWrapper
            propSrc={image}
            propAlt={propAlt || "Preview Image"}
            width={200}
            height={80}
            className="w-full h-full object-center"
          />
        </div>
      }
    >
      <ImageWrapper
        propSrc={image}
        propAlt={propAlt || "Preview Image"}
        width={1280}
        height={720}
        className="w-full h-full object-center"
      />
    </DialogWrapper>
  )
}