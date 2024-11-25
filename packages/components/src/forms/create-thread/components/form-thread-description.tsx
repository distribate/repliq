import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { Controller } from 'react-hook-form';
import { FormChildsProps } from '../types/create-thread-form-types.ts';
import { ChangeEvent } from "react"

export const FormThreadDescription = ({
  control, errors
}: FormChildsProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    onChange(e)
    return updateThreadFormMutation.mutate({
      description: e.target.value
    });
  }
  
  return (
    <div className="flex flex-col gap-y-1 w-full">
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Описание <span className="text-shark-300">[опционально]</span>
        </Typography>
      </div>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, name, ref } }) => (
          <Input
            name={name}
            ref={ref}
            variant="form"
            className="rounded-md"
            placeholder="абоба дескрипшн..."
            status={errors ? 'error' : 'default'}
            onChange={e => handleChange(e, onChange)}
          />
        )}
      />
      {errors.description && (
        <span className="text-red-600 text-[16px] font-normal">
          {errors.description.message}
        </span>
      )}
    </div>
  );
};