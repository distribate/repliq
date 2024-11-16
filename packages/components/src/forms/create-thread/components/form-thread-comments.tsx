import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Toggle } from '@repo/ui/src/components/toggle.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { FormChildsProps } from '../types/create-thread-form-types.ts';

export const FormThreadComments = ({
  errors, control,
}: FormChildsProps) => {
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useCreateThread();
  
  if (!threadFormState.values) return;
  
  const isActive = threadFormState.values.isComments;
  
  return (
    <FormField errorMessage={errors?.comments?.message}>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large">
            Комментирование
          </Typography>
          <Typography textColor="gray" textSize="medium">
            (возможность комментировать пост)
          </Typography>
        </div>
        <Controller
          control={control}
          name="comments"
          render={({ field: { onChange } }) => {
            return (
              <Toggle
                className={isActive ? 'bg-shark-50' : 'bg-shark-800'}
                defaultPressed={isActive || true}
                onPressedChange={(checked: boolean) => {
                  onChange(checked);
                  
                  return updateThreadFormMutation.mutate({
                    values: { isComments: checked },
                  });
                }}
              >
                <Typography textColor={isActive ? 'shark_black' : 'shark_white'} textSize="medium">
                  {isActive ? 'включено' : 'выключено'}
                </Typography>
              </Toggle>
            );
          }}
        />
      </div>
    </FormField>
  );
};