import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Select, SelectTrigger } from '@repo/ui/src/components/select.tsx';
import { AvailableCategories } from './available-categories.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { availableCategoriesQuery } from '../queries/available-query.ts';
import { useState } from 'react';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { FormChildsProps } from '../types/create-thread-form-types.ts';

export const FormThreadCategories = ({
  errors, control,
}: FormChildsProps) => {
  const [ enabled, setEnabled ] = useState<boolean>(false);
  const { data: availableCategories } = availableCategoriesQuery(enabled);
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useCreateThread();
  
  if (!threadFormState) return;
  
  const handleValueChange = (
    value: string, onChange: (v: string) => void,
  ) => {
    onChange(value);
    return updateThreadFormMutation.mutate({ category_id: Number(value) });
  };
  
  const handleOpen = (o: boolean) => {
    if (o && !enabled) {
      setEnabled(true)
    }
  }
  
  const isActive = threadFormState.category_id;
  const selectedCategoryId = threadFormState.category_id;
  const selectedCategoryTitle = availableCategories?.find(
    item => item.id === selectedCategoryId,
  )?.title || null
  
  return (
    <FormField errorMessage={errors?.category?.message}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">Категория</Typography>
        <Typography className="text-shark-300" textSize="medium">
          (категория, близкая к тематике поста)
        </Typography>
      </div>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange } }) => {
          return (
            <Select
              onOpenChange={handleOpen}
              onValueChange={v => handleValueChange(v, onChange)}
            >
              <SelectTrigger
                className={`${isActive ? 'bg-shark-50' : 'bg-shark-800'} flex justify-center `}
              >
                {!threadFormState.category_id ? (
                  <Typography textSize="medium" textColor={isActive ? 'shark_black' : 'shark_white'}>
                    Категория не выбрана
                  </Typography>
                ) : (
                  <Typography textSize="medium" textColor={isActive ? 'shark_black' : 'shark_white'}>
                    {selectedCategoryTitle}
                  </Typography>
                )}
              </SelectTrigger>
              <AvailableCategories enabled={enabled} />
            </Select>
          );
        }}
      />
    </FormField>
  );
};