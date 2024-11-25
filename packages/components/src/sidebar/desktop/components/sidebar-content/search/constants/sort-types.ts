import { Folder, UsersRound } from 'lucide-react';
import { SearchQuery, SearchType } from '../queries/search-query.ts';

type SortType = {
  title: string,
  value: Pick<SearchQuery, "type">["type"],
  icon: any
}

export const SORT_TYPES: SortType[] = [
  {
    title: 'Игрокам',
    value: 'users',
    icon: UsersRound,
  },
  {
    title: 'Топикам',
    value: 'threads',
    icon: Folder,
  },
];