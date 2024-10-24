import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dynamic from 'next/dynamic';
import { FormChildsProps } from './create-thread-form.tsx';

const FormPreviewImageModal = dynamic(() =>
  import('../../../modals/custom/form-preview-image-modal.tsx')
  .then(m => m.FormPreviewImageModal),
);

export const FormThreadPreviewImages = ({
  errors, resetField, images, setValue
}: FormChildsProps & {
  resetField: Function,
  setValue: Function,
  images: File[] | null
}) => {
  const { handleControlImage } = useCreateThreadImages();
  const { data: threadFormState } = threadFormQuery();
  
  const previewFormImages = threadFormState.values?.previewImages;
  const threadTitle = threadFormState.values?.title;
  
  if (!previewFormImages
    || previewFormImages && previewFormImages.length === 0
  ) return;
  
  const handleDeleteImage = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>, index: number,
  ) => {
    return handleControlImage({
      index, e, type: 'delete', resetField, images, setValue
    });
  };
  
  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Typography textColor="shark_white" textSize="medium">
          Прикрепленные изображения
        </Typography>
        <div className="flex items-center gap-2 w-fit">
          {previewFormImages.map((image, i) => (
            <FormPreviewImageModal
              key={i}
              image={image}
              modalTarget={`Thread ${threadTitle || "XXX"}. Image ${i}`}
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