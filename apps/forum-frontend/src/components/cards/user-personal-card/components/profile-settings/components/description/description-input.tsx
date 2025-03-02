import { Input } from '@repo/ui/src/components/input.tsx';
import { useCallback } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { z } from 'zod';
import { getUser } from '@repo/lib/helpers/get-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const descriptionSchema = z.object({
  description: z.string().max(32).nullable(),
});

type DescriptionSchemaType = z.infer<typeof descriptionSchema>;

export const DescriptionInput = () => {
  const { description } = getUser();
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  const { register } = useForm<DescriptionSchemaType>({
    resolver: zodResolver(descriptionSchema),
    mode: "onChange",
    defaultValues: { description },
  });

  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
    if (description === val) return;
    
    return updateFieldMutation.mutate({ criteria: 'description', value: val.length < 1 ? null : val });
  }, 800), []);
  
  return (
    <Input
      placeholder="Описание..."
      className="!text-base"
      backgroundType="transparent"
      {...register("description", {
        onChange: (e) => {
          const { value } = e.target;

          debouncedHandleSearch(value);
        },
      })}
    />
  );
};