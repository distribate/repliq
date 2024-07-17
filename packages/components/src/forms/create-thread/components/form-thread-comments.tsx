import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Toggle } from '@repo/ui/src/components/toggle.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { CreateThreadProps } from '../types/create-thread-form-types.ts';

export const FormThreadComments = ({
  errors, control
}: CreateThreadProps) => {
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useCreateThread();
  
  return (
    <FormField errorMessage={errors}>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="medium">Комментирование</Typography>
          <Typography className="text-shark-300" textSize="small">
            (возможность комментировать пост)
          </Typography>
        </div>
        <Controller
          control={control}
          name="comments"
          render={({ field }) => {
            return (
              <Toggle
                defaultPressed={threadFormState.values?.comments || true}
                onPressedChange={(checked: boolean) => {
                  updateThreadFormMutation.mutate({ values: { comments: checked } });
                  field.onChange(checked);
                }}
              >
                {threadFormState.values?.comments ? 'включено' : 'выключено'}
              </Toggle>
            );
          }}
        />
      </div>
    </FormField>
  )
}