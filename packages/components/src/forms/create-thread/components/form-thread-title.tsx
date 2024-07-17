import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { CreateThreadProps } from '../types/create-thread-form-types.ts';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Controller } from 'react-hook-form';

export const FormThreadTitle = ({
  errors, control,
}: CreateThreadProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  
  return (
    <FormField errorMessage={errors}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="medium">Заголовок</Typography>
        <Typography className="text-shark-300" textSize="small">
          (должен быть внятным и коротким)
        </Typography>
      </div>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value, ref, name } }) => {
          return (
            <Input
              name={name}
              ref={ref}
              value={value}
              className="rounded-md"
              placeholder="абоба тайтл..."
              status={errors ? 'error' : 'default'}
              onChange={(e) => {
                updateThreadFormMutation.mutate({
                  values: {
                    title: value,
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