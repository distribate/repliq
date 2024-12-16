import { Input } from '@repo/ui/src/components/input.tsx';
import { ChangeEvent, useCallback, useState } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

export const DescriptionInput = () => {
  const { data: { description } } = currentUserQuery();
  const [ value, setValue ] = useState<string | ''>(description || '');
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
    return updateFieldMutation.mutate({ criteria: 'description', value: val });
  }, 600), []);
  
  const handleDescriptionInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
    debouncedHandleSearch(value);
  };
  
  return (
    <Input
      value={value}
      onChange={handleDescriptionInput}
      placeholder="Описание..."
      className="!text-base"
      backgroundType="transparent"
    />
  );
};
