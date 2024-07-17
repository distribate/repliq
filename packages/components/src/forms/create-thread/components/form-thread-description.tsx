import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { CreateThreadProps } from '../types/create-thread-form-types.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Controller } from 'react-hook-form';

export const FormThreadDescription = ({
  errors, control
}: CreateThreadProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  
  return (
    <FormField errorMessage={errors}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="medium">
          Описание (опционально)
        </Typography>
        <Typography className="text-shark-300" textSize="small">
          (короткое описание поста)
        </Typography>
      </div>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, ref, value } }) => {
          return (
            <Input
              ref={ref}
              className="rounded-md"
              value={value}
              placeholder="абоба дескрипшн..."
              status={errors ? 'error' : 'default'}
              onChange={(e) => {
                updateThreadFormMutation.mutate({
                  values: {
                    description: value,
                  },
                });
                
                onChange(e);
              }}
            />
          );
        }}
      />
    </FormField>
  );
};