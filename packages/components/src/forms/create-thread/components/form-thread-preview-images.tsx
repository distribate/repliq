import { threadFormQuery } from '../queries/thread-form-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FormChildsProps } from '../types/create-thread-form-types.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { DeleteButton } from '@repo/ui/src/components/detele-button.tsx';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import React, { ChangeEvent } from 'react';
import { useCreateThread } from '#forms/create-thread/hooks/use-create-thread.tsx';

type FormThreadPreviewImagesProps = FormChildsProps & {
  resetField: Function,
  setValue: Function,
  images: File[] | null
}

export const FormThreadPreviewImages = ({
  errors, resetField, images, setValue,
}: FormThreadPreviewImagesProps) => {
  const { handleControlImage } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();
  
  if (!threadFormState || !threadFormState.images) return null;
  
  const previewFormImages = threadFormState.images;
  
  const handleDeleteImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | ChangeEvent<HTMLInputElement>, index: number,
  ) => {
    e.preventDefault();
    return handleControlImage({ index, type: 'delete', resetField, images, setValue });
  };
  
  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Typography textColor="shark_white" textSize="large">
          Прикрепленные изображения
        </Typography>
        <div className="flex flex-wrap items-start justify-start gap-4">
          {previewFormImages.map((image, i) => (
            <Dialog>
              <DialogTrigger>
                <div className="relative w-fit group overflow-hidden">
                  <DeleteButton
                    onClick={e => handleDeleteImage(e, i)}
                    variant="invisible"
                  />
                  <ImageWrapper
                    propSrc={image}
                    propAlt={''}
                    width={1200}
                    height={1200}
                    className="max-w-[140px] h-fit rounded-md"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="p-0">
                <img
                  src={image}
                  alt={''}
                  width={1920}
                  height={1080}
                  className="w-full h-full"
                />
              </DialogContent>
            </Dialog>
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