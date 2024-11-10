import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { SelectedWrapper } from '#wrappers/selected-wrapper.tsx';
import { LayoutGrid } from 'lucide-react';
import { VIEW_COMPONENTS_TYPE } from '#friends/components/filtering/contants/view-components-type.ts';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { ChangeEvent, forwardRef, useState } from 'react';
import { Input } from '@repo/ui/src/components/input.tsx';
import { FilteringSearchWrapper } from '#wrappers/filtering-search-wrapper.tsx';

type ProfileThreasdFilteringProps = {
  threadsLength: number
}

export const ProfileThreadsFiltering = ({
  threadsLength
}: ProfileThreasdFilteringProps) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-1 w-fit">
        <Typography textColor="shark_white" className="text-lg font-semibold">
          Треды
        </Typography>
        <Typography textSize="medium" className="text-shark-300">
          [всего {threadsLength}]
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-fit">
        <FilteringSearchWrapper>
          <ProfileThreadsFilteringSearch />
        </FilteringSearchWrapper>
      </div>
      <div className="w-fit">
        <DropdownWrapper
          properties={{
            sideAlign: 'bottom', contentAlign: 'end', contentClassname: 'w-[200px]',
          }}
          trigger={
            <SelectedWrapper>
              <LayoutGrid size={20} className="text-shark-300" />
            </SelectedWrapper>
          }
          content={
            <div className="flex flex-col gap-y-2">
              <Typography textSize="small" className="text-shark-300 px-2 pt-2">
                Вид
              </Typography>
              <div className="flex flex-col gap-y-2">
                {VIEW_COMPONENTS_TYPE.map(view => (
                  <DropdownMenuItem
                    key={view.name}
                    // onClick={() => handleView(view.name)}
                    className="items-center gap-1"
                  >
                    <view.icon size={16} className="text-shark-300" />
                    <Typography
                      // className={isViewType(view.name) ? 'text-caribbean-green-500' : ''}
                    >
                      {view.title}
                    </Typography>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

const ProfileThreadsFilteringSearch = forwardRef<
  HTMLInputElement
>((props, ref) => {
  const [ value, setValue ] = useState<string>('');
  
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
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