import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Controller } from 'react-hook-form';
import { Select, SelectTrigger } from '@repo/ui/src/components/select.tsx';
import { AvailableCategories } from './available-categories.tsx';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { availableCategoriesQuery } from '../queries/available-query.ts';
import { useState } from 'react';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { CreateThreadProps } from '../types/create-thread-form-types.ts';
import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { FormChildsProps } from './create-thread-form.tsx';

export const FormThreadCategories = ({
  errors, control,
}: FormChildsProps) => {
  const [ categoriesEnabled, setCategoriesEnabled ] = useState<boolean>(false);
  const { data: availableCategories } = availableCategoriesQuery({
    enabled: categoriesEnabled,
  });
  
  const { updateThreadFormMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();
  
  return (
    <FormField errorMessage={errors?.category?.message}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="medium">Категория</Typography>
        <Typography className="text-shark-300" textSize="small">
          (категория, близкая к тематике поста)
        </Typography>
      </div>
      <Controller
        control={control}
        name="category"
        render={({ field }) => {
          return (
            <Select
              onOpenChange={(open: boolean) => {
                if (!categoriesEnabled && open) setCategoriesEnabled(true);
              }}
              onValueChange={(value: string) => {
                updateThreadFormMutation.mutate({
                  values: {
                    category_id: Number(value),
                  },
                });
                field.onChange(value);
              }}
            >
              <SelectTrigger className="bg-shark-900">
                {!threadFormState.values?.category_id ? (
                  <Typography textSize="medium" textColor="shark_white">
                    Категория не выбрана
                  </Typography>
                ) : (
                  availableCategories?.find(
                    item => item.id === threadFormState.values?.category_id,
                  )?.title
                )}
              </SelectTrigger>
              <AvailableCategories categoriesEnabled={categoriesEnabled} />
            </Select>
          );
        }}
      />
    </FormField>
  );
};