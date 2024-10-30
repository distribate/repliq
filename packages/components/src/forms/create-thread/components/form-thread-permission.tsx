import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Toggle } from '@repo/ui/src/components/toggle.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { FormChildsProps } from '../types/create-thread-form-types.ts';

export const FormThreadPermissions = ({
  errors, control,
}: FormChildsProps) => {
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useCreateThread();
  
  if (!threadFormState.values) return;
  
  const isActive = threadFormState.values.permission;
  
  return (
    <FormField errorMessage={errors?.permission?.message}>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large">
            Хайд
          </Typography>
          <Typography textColor="gray" textSize="medium">
            (просмотр поста за валюту)
          </Typography>
        </div>
        <Controller
          control={control}
          name="permission"
          render={({ field: { onChange } }) => {
            return (
              <Toggle
                className={isActive ? "bg-shark-50" : "bg-shark-800"}
                defaultPressed={isActive || false}
                onPressedChange={(checked: boolean) => {
                  onChange(checked);
                  
                  return updateThreadFormMutation.mutate({
                    values: { permission: checked, },
                  })
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