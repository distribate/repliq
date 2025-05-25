import { Input } from '@repo/ui/src/components/input.tsx';
import { useCallback } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { z } from 'zod';
import { getUser } from '@repo/lib/helpers/get-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { reatomComponent } from '@reatom/npm-react';
import { updateCurrentUserAction } from '../../models/update-current-user.model';
import { spawn } from '@reatom/framework';

const descriptionSchema = z.object({
  description: z.string().max(32).nullable(),
});

type DescriptionSchemaType = z.infer<typeof descriptionSchema>;

const DEBOUNCE_DELAY = 800

export const DescriptionInput = reatomComponent(({ ctx }) => {
  const description = getUser(ctx).description;
  
  const { register } = useForm<DescriptionSchemaType>({
    resolver: zodResolver(descriptionSchema),
    mode: "onChange",
    defaultValues: { description },
  });

  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
    if (description === val) return;
    
    void spawn(ctx, async (spawnCtx) => 
      updateCurrentUserAction(spawnCtx, { criteria: 'description', value: val.length < 1 ? null : val })
    );
  }, DEBOUNCE_DELAY), []);
  
  return (
    <Input
      placeholder="Описание..."
      className="!text-base"
      backgroundType="transparent"
      {...register("description", {
        onChange: (e) => debouncedHandleSearch(e.target.value),
      })}
    />
  );
}, "DescriptionInput")