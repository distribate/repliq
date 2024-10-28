import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Controller } from 'react-hook-form';
import { FormChildsProps } from '../types/create-thread-form-types.ts';

export const FormThreadTitle = ({
  control, errors,
}: FormChildsProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  
  return (
    <FormField errorMessage={errors?.title?.message}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="medium">
          Заголовок
        </Typography>
        <Typography className="text-shark-300" textSize="small">
          (должен быть внятным и коротким)
        </Typography>
      </div>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, name, ref } }) => (
          <Input
            name={name}
            ref={ref}
            className="rounded-md"
            placeholder="абоба тайтл..."
            status={errors ? 'error' : 'default'}
            onChange={e => {
              onChange(e);
              return updateThreadFormMutation.mutate({
                values: {
                  title: e.target.value,
                },
              });
            }}
          />
        )}
      />
    </FormField>
  );
};