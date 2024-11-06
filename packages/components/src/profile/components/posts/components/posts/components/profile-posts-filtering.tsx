import React, { ChangeEvent, forwardRef, useCallback, useState } from 'react';
import { useDebounce } from '@repo/lib/hooks/use-debounce.ts';
import { Input } from '@repo/ui/src/components/input.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FilteringSearch } from '#filtering/components/filtering-search.tsx';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';

const ProfilePostsFilteringSearch = forwardRef<
  HTMLInputElement
>((props, ref) => {
  const [ value, setValue ] = useState('');
  
  const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
  
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
      placeholder="Поиск по названию"
      onChange={handleSearchInput}
      {...props}
    />
  );
});

const POSTS_SORT_ITEMS = [
  {
    title: 'По дате публикации', value: 'created_at',
  },
];

type ProfilePostsFilteringProps = {
  postsLength: number
}

export const ProfilePostsFiltering = ({
  postsLength,
}: ProfilePostsFilteringProps) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-1 w-fit">
        <Typography textColor="shark_white" className="text-lg font-semibold">
          Посты
        </Typography>
        <Typography textSize="medium" className="text-shark-300">
          [всего {postsLength}]
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-fit">
        <FilteringSearch>
          <ProfilePostsFilteringSearch />
        </FilteringSearch>
        <div className="w-fit">
          <DropdownWrapper
            properties={{
              sideAlign: 'bottom', contentAlign: 'end', contentClassname: 'w-[200px]',
            }}
            trigger={
              <div className="flex items-center gap-1">
                <Typography className="text-shark-300" textSize="medium">
                  {POSTS_SORT_ITEMS[0].title}
                </Typography>
              </div>
            }
            content={
              <div className="flex flex-col gap-y-4">
                <Typography className="text-shark-300 text-sm px-2 pt-2">
                  Фильтровать по
                </Typography>
                <div className="flex flex-col gap-y-2">
                  {POSTS_SORT_ITEMS.map((item, i) => (
                    <DropdownMenuItem
                      key={i}
                      // onClick={(e) => handleSort(e, item.value)}
                    >
                      <Typography>
                        {item.title}
                      </Typography>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};