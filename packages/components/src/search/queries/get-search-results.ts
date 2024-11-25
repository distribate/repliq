import { SearchType } from '#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts';
import { SearchResultsAll } from '#search/queries/search-page-query.ts';
import { getSearchThreads } from '#sidebar/desktop/components/sidebar-content/search/queries/get-search-topics.ts';
import { getSearchUsers } from '#sidebar/desktop/components/sidebar-content/search/queries/get-search-users.ts';
import { shuffleArray } from '#search/helpers/shuffler.ts';
import { RequestDetails } from '@repo/types/entities/entities-type.ts';

type GetSearchResults = RequestDetails & {
  value: string | null;
  type: SearchType;
  user: 'threads' | 'all' extends SearchType ? string | null : null;
};

export async function getSearchResults({
  type, value, limit, user
}: GetSearchResults): Promise<SearchResultsAll | null> {
  if (!value && type !== 'threads') return null;
  
  const searchThreads = () => getSearchThreads({ searchedValue: value, limit, user });
  const searchUsers = () => getSearchUsers({ searchedValue: value || '', limit, });
  
  switch (type) {
    case 'threads':
      return searchThreads();
    
    case 'users':
      return value ? searchUsers() : null;
    
    case 'all': {
      const [threads, users] = await Promise.all([
        searchThreads(),
        searchUsers()
      ]);
      
      return shuffleArray([...threads, ...users]);
    }
    
    default:
      return null;
  }
}