'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { THREAD_FORM_QUERY, threadFormQuery, ThreadFormQuery } from '../queries/thread-form-query.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { BlockWrapper } from '../../../wrappers/block-wrapper.tsx';
import { FormThreadContent } from './form-thread-content.tsx';
import { FormThreadCategories } from './form-thread-categories.tsx';
import { FormThreadComments } from './form-thread-comments.tsx';
import { FormThreadDescription } from './form-thread-description.tsx';
import { FormThreadTitle } from './form-thread-title.tsx';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { useQueryClient } from '@tanstack/react-query';

const ImageWrapper = dynamic(() =>
  import('../../../wrappers/image-wrapper.tsx')
  .then(m => m.ImageWrapper),
);

const DialogWrapper = dynamic(() =>
  import('../../../wrappers/dialog-wrapper.tsx')
  .then(m => m.DialogWrapper),
);

const AdditionalSections = dynamic(() =>
  import('./additional-sections.tsx')
  .then(m => m.AdditionalSections),
);

const FormThreadImages = ({
  threadTitle
}: {
  threadTitle?: string
}) => {
  const {
    handleDeleteImage, previewFormImages, errors
  } = useCreateThreadImages()
  
  if (!threadTitle) return;
  
  return (
    previewFormImages && previewFormImages.length >= 1 && (
      <>
        <div className="flex flex-col items-start gap-2 w-full">
          <Typography textColor="shark_white" textSize="medium">
            Прикрепленные изображения
          </Typography>
          <div className="flex items-center gap-2 w-fit">
            {previewFormImages.map(image => URL.createObjectURL(image)).map((image, i) => (
              <DialogWrapper
                key={i}
                name={`Thread ${threadTitle}. Image ${i}`}
                trigger={
                  <div
                    key={i}
                    className="relative max-h-[160px] max-w-[320px] overflow-hidden rounded-md"
                  >
                    <div className="absolute right-2 top-2">
                      <X
                        size={18}
                        className="text-shark-300 hover:text-red-600"
                        onClick={(e) => handleDeleteImage({
                          index: i, e,
                        })}
                      />
                    </div>
                    <ImageWrapper
                      propSrc={image} propAlt={i.toString()}
                      width={200} height={80}
                      className="w-full h-full object-center"
                    />
                  </div>
                }
              >
                <ImageWrapper
                  propSrc={image} propAlt={i.toString()}
                  width={1280} height={720}
                  className="w-full h-full object-center"
                />
              </DialogWrapper>
            ))}
          </div>
        </div>
        {errors.images && (
          <span className="text-red-500 text-sm">
            {errors.images.message}
          </span>
        )}
      </>
    )
  );
};

export const CreateThreadForm = () => {
  const { data: threadFormState } = threadFormQuery()
  const { createPostThreadMutation } = useCreateThread();
  const {
    formImages, handleSubmit, isValid, errors, control
  } = useCreateThreadImages()
  
  const onSubmit = () => {
    const formImagesArray = Array.from(formImages || [])
    
    createPostThreadMutation.mutate({
      images: formImagesArray
    });
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row items-start gap-4 w-full overflow-hidden"
    >
      <div className="flex flex-col gap-y-4 flex-grow-0 min-w-0 w-full lg:w-3/4">
        <BlockWrapper className="flex flex-col gap-y-6 w-full overflow-hidden !p-4">
          <FormThreadTitle
            control={control}
            errors={errors?.title?.message}
          />
          <FormThreadDescription
            control={control}
            errors={errors?.description?.message}
          />
          <FormThreadContent
            control={control}
            errors={errors?.content?.message}
          />
          <FormThreadImages threadTitle={threadFormState.values?.title} />
        </BlockWrapper>
        <AdditionalSections />
      </div>
      <BlockWrapper className="flex flex-col gap-y-4 w-full lg:!w-1/4 flex-grow-0 sticky min-w-0 !p-4 top-0 h-fit">
        <FormThreadCategories
          control={control}
          errors={errors?.category?.message}
        />
        <Separator />
        <div
          className="flex flex-col gap-4 items-start h-full *:px-3 *:py-2 *:rounded-md *:w-full">
          <FormThreadComments
            control={control}
            errors={errors?.comments?.message}
          />
          {/*<FormThreadAutoRemove control={control} errors={errors?.auto_remove?.message} />*/}
          {/*<FormThreadPermissions control={control} errors={errors?.permission?.message} />*/}
        </div>
        <Separator />
        <Button
          disabled={createPostThreadMutation.isPending || !isValid}
          pending={createPostThreadMutation.isPending}
        >
          Опубликовать
        </Button>
      </BlockWrapper>
    </form>
  );
};