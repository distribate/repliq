'use client';

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
import dynamic from 'next/dynamic';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import { zodCreateThreadForm } from '../types/create-thread-form-types.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { createThreadSchema } from '../schemas/create-thread-schema.ts';
import { DebugPanel } from '../../../debug/debug-panel.tsx';

const FormThreadPreviewImages = dynamic(() =>
  import('./form-thread-preview-images.tsx')
  .then(m => m.FormThreadPreviewImages),
);

const FormThreadAutoRemove = dynamic(() =>
  import('./form-thread-auto-remove.tsx')
  .then(m => m.FormThreadAutoRemove),
);

const FormThreadPermissions = dynamic(() =>
  import('./form-thread-permission.tsx')
  .then(m => m.FormThreadPermissions),
);

const AdditionalSections = dynamic(() =>
  import('./additional-sections.tsx')
  .then(m => m.AdditionalSections),
);

export type FormChildsProps = {
  control: Control<zodCreateThreadForm, any>,
  errors: FieldErrors<zodCreateThreadForm>
}

export const CreateThreadForm = () => {
  const { data: threadFormState } = threadFormQuery();
  const { createPostThreadMutation } = useCreateThread();
  
  const { control, handleSubmit, setValue, resetField, getValues, formState: { errors, isValid } } = useForm<zodCreateThreadForm>({
    mode: 'onChange',
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      comments: true, permission: false, auto_remove: false, images: null,
    },
  });
  
  const onSubmit = () => {
    const formImages = getValues('images');
    
    createPostThreadMutation.mutate({
      images: Array.from(formImages || []),
    });
  };
  
  const formChildsObj: FormChildsProps = {
    errors: errors,
    control: control,
  };

  return (
    <>
      <DebugPanel values={threadFormState} position="left" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row items-start
        gap-4 w-full overflow-hidden"
      >
        <div
          className="flex flex-col gap-y-4 flex-grow-0 min-w-0 w-full lg:w-3/4"
        >
          <BlockWrapper
            className="flex flex-col gap-y-6 w-full
            overflow-hidden !p-4"
          >
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
        <BlockWrapper
          className="flex flex-col gap-y-4 w-full lg:!w-1/4
          flex-grow-0 sticky min-w-0 !p-4 top-0 h-fit"
        >
          <FormThreadCategories {...formChildsObj} />
          <Separator />
          <div
            className="flex flex-col gap-4 items-start h-full
            *:rounded-md *:w-full"
          >
            <FormThreadComments {...formChildsObj} />
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
      </form>
    </>
  );
};