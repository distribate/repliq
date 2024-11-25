'use client';

import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import { FormThreadContent } from './form-thread-content.tsx';
import { FormThreadCategories } from './form-thread-categories.tsx';
import { FormThreadComments } from './form-thread-comments.tsx';
import { FormThreadDescription } from './form-thread-description.tsx';
import { FormThreadTitle } from './form-thread-title.tsx';
import { useForm } from 'react-hook-form';
import { FormChildsProps, zodCreateThreadForm } from '../types/create-thread-form-types.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { createThreadSchema } from '../schemas/create-thread-schema.ts';
import { threadFormQuery } from '#forms/create-thread/queries/thread-form-query.ts';
import dynamic from 'next/dynamic';

const FormThreadPreviewImages = dynamic(() =>
  import('./form-thread-preview-images.tsx').then(m => m.FormThreadPreviewImages),
);

// const FormThreadAutoRemove = dynamic(() =>
//   import('./form-thread-auto-remove.tsx').then(m => m.FormThreadAutoRemove),
// );

// const FormThreadPermissions = dynamic(() =>
//   import('./form-thread-permission.tsx').then(m => m.FormThreadPermissions),
// );

const AdditionalSections = dynamic(() =>
  import('./additional-sections.tsx').then(m => m.AdditionalSections),
);

export const CreateThreadForm = () => {
  const { createPostThreadMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();
  
  const {
    control, handleSubmit, setValue, resetField, getValues, formState: { errors, isValid },
  } = useForm<zodCreateThreadForm>({
    mode: 'onChange',
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      comments: threadFormState.isComments,
      permission: threadFormState.permission,
      auto_remove: threadFormState.auto_remove,
      images: null
    },
  });
  
  const formChildsObj: FormChildsProps = { errors, control };
  
  return (
    <form
      onSubmit={handleSubmit(() => createPostThreadMutation.mutate())}
      className="flex items-start gap-4 w-full"
    >
      <div className="flex flex-col gap-y-4 w-3/4 max-w-3/4 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
          <FormThreadTitle {...formChildsObj} />
          <FormThreadDescription {...formChildsObj} />
          <FormThreadContent {...formChildsObj} />
          <FormThreadPreviewImages
            setValue={setValue}
            images={getValues('images')}
            resetField={resetField}
            {...formChildsObj}
          />
        </BlockWrapper>
        <AdditionalSections />
      </div>
      <div className="flex flex-grow-0 sticky w-1/4 max-w-1/4 top-0 h-fit">
        <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
          <FormThreadCategories {...formChildsObj} />
          <Separator />
          <div className="flex flex-col gap-4 items-start h-full *:rounded-md *:w-full">
            <FormThreadComments {...formChildsObj} />
            {/* // todo: */}
            {/* // trigger.dev */}
            {/* // permission for thread */}
            {/*<FormThreadAutoRemove {...formChildsObj} />*/}
            {/*<FormThreadPermissions {...formChildsObj} />*/}
          </div>
          <Separator />
          <Button
            variant="positive"
            disabled={createPostThreadMutation.isPending || !isValid}
            pending={createPostThreadMutation.isPending}
          >
            Опубликовать
          </Button>
        </BlockWrapper>
      </div>
    </form>
  );
};