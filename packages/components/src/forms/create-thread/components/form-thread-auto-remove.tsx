import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Toggle } from '@repo/ui/src/components/toggle.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { FormChildsProps } from './create-thread-form.tsx';

export const FormThreadAutoRemove = ({
  control, errors
}: FormChildsProps) => {
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useCreateThread();
  
  return (
    <FormField errorMessage={errors?.auto_remove?.message}>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="medium">
            Авто-удаление
          </Typography>
          <Typography className="text-shark-300" textSize="small">
            (автоматическое удаление поста через заданное время)
          </Typography>
        </div>
        <Controller
          control={control}
          name="auto_remove"
          render={({ field }) => {
            return (
              <Toggle
                className="bg-shark-900"
                defaultPressed={threadFormState.values?.auto_remove || false}
                onPressedChange={(checked: boolean) => {
                  updateThreadFormMutation.mutate({
                    values: {
                      auto_remove: checked
                    }
                  });
                  field.onChange(checked);
                }}
              >
                {threadFormState.values?.auto_remove ? 'включено' : 'выключено'}
              </Toggle>
            );
          }}
        />
      </div>
    </FormField>
  )
}