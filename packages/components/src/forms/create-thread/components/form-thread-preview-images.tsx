import { CreateThreadImageControl, useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dynamic from 'next/dynamic';
import { FormChildsProps } from '../types/create-thread-form-types.ts';

const FormPreviewImageModal = dynamic(() =>
  import('../../../modals/custom/form-preview-image-modal.tsx')
  .then(m => m.FormPreviewImageModal),
);

type FormThreadPreviewImagesProps = FormChildsProps & {
  resetField: Function,
  setValue: Function,
  images: File[] | null
}

export const FormThreadPreviewImages = ({
  errors, resetField, images, setValue,
}: FormThreadPreviewImagesProps) => {
  const { handleControlImage } = useCreateThreadImages();
  const { data: threadFormState } = threadFormQuery();
  
  if (!threadFormState.values) return null;
  
  const previewFormImages = threadFormState.values.images;

  if (!previewFormImages
    || previewFormImages && previewFormImages.length === 0
  ) return;
  
  const handleDeleteImage = (
    e: Pick<CreateThreadImageControl, 'e'>['e'], index: number,
  ) => {
    return handleControlImage({
      index, e, type: 'delete', resetField, images, setValue,
    });
  };
  
  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Typography textColor="shark_white" textSize="large">
          Прикрепленные изображения
        </Typography>
        <div className="flex flex-wrap items-start justify-start gap-4">
          {previewFormImages.map((image, i) => (
            <FormPreviewImageModal
              key={i}
              image={image}
              handleDeleteImage={(e) => handleDeleteImage(e, i)}
            />
          ))}
        </div>
      </div>
      {errors.images &&
        <span className="text-red-500 text-sm">
          {errors.images.message}
        </span>
      }
    </>
  );
};