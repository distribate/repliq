import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Toggle } from '@repo/ui/src/components/toggle.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { FormChildsProps } from './create-thread-form.tsx';

export const FormThreadPermissions = ({
  errors, control
}: FormChildsProps) => {
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useCreateThread();

  return (
    <FormField errorMessage={errors?.permission?.message}>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="medium">
            Хайд
          </Typography>
          <Typography className="text-shark-300" textSize="small">
            (просмотр поста за валюту)
          </Typography>
        </div>
        <Controller
          control={control}
          name="permission"
          render={({ field: { onChange, ref, value } }) => {
            return (
              <Toggle
                className="bg-shark-900"
                defaultPressed={threadFormState.values?.permission || false}
                onPressedChange={(checked: boolean) => {
                  updateThreadFormMutation.mutate({
                    values: {
                      permission: checked
                    }
                  });
                  onChange(checked);
                }}
              >
                {threadFormState.values?.permission ? 'включено' : 'выключено'}
              </Toggle>
            );
          }}
        />
      </div>
    </FormField>
  )
}