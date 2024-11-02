import { FriendsFilteringViewType } from '#friends/components/filtering/queries/friends-filtering-query.ts';
import { AlignJustify, LayoutGrid } from 'lucide-react';

type ViewComponentsType = {
  name: FriendsFilteringViewType,
  title: string,
  icon: any
}

export const VIEW_COMPONENTS_TYPE: ViewComponentsType[] = [
  {
    name: "list", title: 'Список', icon: AlignJustify,
  },
  {
    name: 'grid', title: 'Сетка', icon: LayoutGrid,
  },
];