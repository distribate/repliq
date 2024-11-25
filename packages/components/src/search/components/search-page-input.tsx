'use client';

import { Input } from '@repo/ui/src/components/input.tsx';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchPage } from '#search/hooks/use-search-page.ts';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { SearchType } from '#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts';

export const SearchPageInput = () => {
  const searchParams = useSearchParams();
  const paramQueryValue = searchParams.get('queryValue');
  const [ value, setValue ] = useState<string>(paramQueryValue || '');
  const searchType = searchParams.get('type') as SearchType ?? 'all';
  const userByParam = searchParams.get('user') as string || null;
  const { setValueMutation } = useSearchPage(searchType);
  
  useEffect(() => {
    if (paramQueryValue) setValue(paramQueryValue);
    if (userByParam) setValueMutation.mutate({ user: userByParam });
  }, []);
  
  useEffect(() => {
    setValueMutation.mutate({ queryValue: value });
  }, [ searchType ]);
  
  const updateQuery = (queryValue: string) => {
    return setValueMutation.mutate({ queryValue });
  };
  
  const debounceUpdateQuery = useDebounce(updateQuery, 300);
  
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setValue(value);
    debounceUpdateQuery(value);
  };
  
  return (
    <Input
      value={value}
      placeholder="Поиск..."
      className="w-full h-full !rounded-md text-xl"
      backgroundType="transparent"
      onChange={handleSearch}
    />
  );
};