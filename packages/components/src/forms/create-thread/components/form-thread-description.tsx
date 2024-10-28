import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Controller } from 'react-hook-form';
import { FormChildsProps } from '../types/create-thread-form-types.ts';

export const FormThreadDescription = ({
  control, errors
}: FormChildsProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  
  return (
    <FormField errorMessage={errors?.description?.message}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="medium">
          Описание (опционально)
        </Typography>
        <Typography className="text-shark-300" textSize="small">
          (короткое описание поста)
        </Typography>
      </div>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, name, ref } }) => (
          <Input
            name={name}
            ref={ref}
            className="rounded-md"
            placeholder="абоба дескрипшн..."
            status={errors ? 'error' : 'default'}
            onChange={e => {
              onChange(e)
              return updateThreadFormMutation.mutate({
                values: {
                  description: e.target.value,
                },
              });
            }}
          />
        )}
      />
    </FormField>
  );
};