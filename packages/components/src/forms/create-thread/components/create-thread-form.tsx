'use client';

import { useForm } from 'react-hook-form';
import { zodCreateThreadForm } from '../types/create-thread-form-types.ts';
import { createThreadSchema } from '../schemas/create-thread-schema.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { threadFormQuery } from '../queries/thread-form-query.ts';
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
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

export const CreateThreadForm = () => {
  const [ images, setImages ] = useState<File[]>([]);
  
  const { data: threadFormState } = threadFormQuery();
  const { createPostThreadMutation } = useCreateThread();
  
  const {
    control, handleSubmit, resetField, watch,
    formState: { errors, isValid },
  } = useForm<zodCreateThreadForm>({
    mode: 'onChange',
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      comments: threadFormState.values?.comments || true,
      description: '', title: '', permission: false,
      auto_remove: false, category: '',
    },
  });
  
  const formImages = watch('images');
  
  const onSubmit = () => {
    createPostThreadMutation.mutate({ images: images, });
  };
  
  useEffect(() => {
    const imagesFile = Array.from(formImages || []).slice(0, 2);
    
    if (images.length <= 1) {
      setImages((prevImages) => prevImages.concat(imagesFile));
    }
  }, [ formImages ]);
  
  const handleDeleteImage = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>, index: number
  ) => {
    e.preventDefault();
    
    if (images.length <= 1) resetField('images');
    
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row items-start gap-4 w-full overflow-hidden"
    >
      <div className="flex flex-col gap-y-4 flex-grow-0 min-w-0 w-full lg:w-3/4">
        <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
          <Typography textSize="big" textColor="shark_white">Создание треда</Typography>
        </BlockWrapper>
        <BlockWrapper className="flex flex-col gap-y-6 w-full overflow-hidden !p-4">
          <FormThreadTitle control={control} errors={errors?.title?.message} />
          <FormThreadDescription control={control} errors={errors?.description?.message} />
          <FormThreadContent control={control} errors={errors?.content?.message} />
          {images && images.length >= 1 && (
            <>
              <div className="flex flex-col items-start gap-2 w-full">
                <Typography textColor="shark_white" textSize="medium">Прикрепленные изображения</Typography>
                <div className="flex items-center gap-2 w-fit">
                  {images.map(
                    image => URL.createObjectURL(image),
                  ).map((image, i) => (
                    <DialogWrapper
                      key={i}
                      trigger={
                        <div
                          key={i}
                          className="relative max-h-[160px] max-w-[320px] overflow-hidden rounded-md"
                        >
                          <div className="absolute right-2 top-2">
                            <X
                              size={18}
                              className="text-shark-300 hover:text-red-600"
                              onClick={(e) => handleDeleteImage(e, i)}
                            />
                          </div>
                          <ImageWrapper
                            propSrc={image} propAlt={i.toString()}
                            width={200} height={80}
                            className="w-full h-full object-center"
                          />
                        </div>
                      }
                      name={`Thread ${threadFormState.values?.title}. Image ${i}`}
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
              {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
            </>
          )}
        </BlockWrapper>
        <AdditionalSections />
      </div>
      <BlockWrapper className="flex flex-col gap-y-4 w-full lg:!w-1/4 flex-grow-0 sticky min-w-0 !p-4 top-0 h-fit">
        <FormThreadCategories control={control} errors={errors?.category?.message} />
        <Separator />
        <div
          className="flex flex-col gap-4 items-start h-full *:border-[1px] *:border-white/10 *:px-3 *:py-2 *:rounded-md *:w-full">
          <FormThreadComments control={control} errors={errors?.comments?.message} />
          {/*<FormThreadAutoRemove control={control} errors={errors?.auto_remove?.message} />*/}
          {/*<FormThreadPermissions control={control} errors={errors?.permission?.message} />*/}
        </div>
        <Separator />
        <Button
          disabled={createPostThreadMutation.isPending || !isValid}
          pending={createPostThreadMutation.isPending}
        >
          <Typography>Опубликовать</Typography>
        </Button>
      </BlockWrapper>
    </form>
  );
};