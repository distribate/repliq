import { Input } from '@repo/ui/src/components/input.tsx';
import { ChangeEvent, useCallback } from 'react';
import { useSearchControl } from '../hooks/use-search-control.tsx';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { searchQuery } from '../queries/search-query.ts';
import Inspector from '@repo/assets/images/minecraft/block_inspect.webp';
import { SearchSort } from './search-sort.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';

export const SearchInput = () => {
  const { handleSearchMutation, setSearchQueryMutation, } = useSearchControl();
  const { data: searched } = searchQuery();
  
  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
    handleSearchMutation.mutate(val);
  }, 400), []);
  
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: raw } = e.target;
    
    let value: string;
    
    if (searched.type === 'users') {
      value = raw.replace(' ', '');
    }
    
    value = raw;
    
    setSearchQueryMutation.mutate({ value: value, });
    debouncedHandleSearch(value);
  };
  
  return (
    <>
      <Separator />
      <div className="flex bg-shark-800 items-center px-2 w-full justify-between rounded-md">
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md w-[44px]">
            <ImageWrapper
              propSrc={Inspector.src}
              propAlt="Search spyglass"
              className="w-[24px] h-[24px]"
              width={24}
              height={24}
              loading="lazy"
            />
          </div>
          <Input
            backgroundType="transparent"
            value={searched.value}
            onChange={handleSearchInput}
            className="rounded-md !px-0 w-full"
            placeholder="Поиск"
          />
        </div>
        <SearchSort />
      </div>
    </>
  );
};