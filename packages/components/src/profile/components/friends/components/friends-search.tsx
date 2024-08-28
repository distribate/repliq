'use client';

import { Input } from '@repo/ui/src/components/input.tsx';
import { useFriendsSort } from '../hooks/use-friends-sort.tsx';
import { ChangeEvent, forwardRef, useCallback, useState } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';

export const FriendsSearch = forwardRef<
  HTMLInputElement
>((props, ref) => {
  const [ value, setValue ] = useState('');
  const { setFriendsSortMUtation } = useFriendsSort();
  
  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
    setFriendsSortMUtation.mutate({ search: val });
  }, 100), []);
  
  const handleSearchInput = (e: ChangeEvent<
    HTMLInputElement
  >) => {
    const { value } = e.target;
    
    setValue(value);
    debouncedHandleSearch(value);
  };
  
  return (
    <Input
      ref={ref}
      className="rounded-lg"
      value={value}
      placeholder="Поиск по нику"
      onChange={handleSearchInput}
      {...props}
    />
  );
});