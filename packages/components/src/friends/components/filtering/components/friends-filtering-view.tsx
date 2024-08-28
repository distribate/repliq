import { AlignJustify, LayoutGrid } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import React from 'react';
import { DropdownWrapper } from '../../../../wrappers/dropdown-wrapper.tsx';
import { SelectedWrapper } from '../../../../wrappers/selected-wrapper.tsx';
import { useFriendSort } from '../hooks/use-friends-sort.ts';
import { friendsFilteringQuery, FriendsFilteringViewType } from '../queries/friends-filtering-query.ts';
import { isValue } from '@repo/lib/helpers/check-is-value.ts';

type ViewComponentsType = {
  name: FriendsFilteringViewType,
  title: string,
  icon: any
}

const VIEW_COMPONENTS_TYPE: ViewComponentsType[] = [
  {
    name: "list",
    title: 'Список',
    icon: AlignJustify,
  },
  {
    name: 'grid',
    title: 'Сетка',
    icon: LayoutGrid,
  },
];

export const FriendsFilteringView = () => {
  const { data: friendsFiltering } = friendsFilteringQuery()
  const { setValueMutation } = useFriendSort();
  
  const handleView = (value: FriendsFilteringViewType) => {
    setValueMutation.mutate({
      value, type: 'view',
    });
  };
  
  const isViewType = isValue(friendsFiltering.viewType);
  
  return (
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
                  onClick={() => handleView(view.name)}
                  className="items-center gap-1"
                >
                  <view.icon size={16} className="text-shark-300" />
                  <Typography className={isViewType(view.name) ? 'text-caribbean-green-500' : ''}>
                    {view.title}
                  </Typography>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
};