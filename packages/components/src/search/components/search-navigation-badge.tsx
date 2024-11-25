"use client"

import { NavigationBadge } from '#navigation/components/navigation-badge.tsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchType } from '#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts';

const SEARCH_TYPE_QUERY_KEY = "type"

type SearchNavigationBadgeProps = {
  title: string,
  paramValue: SearchType
}

export const SearchNavigationBadge = ({
  title, paramValue
}: SearchNavigationBadgeProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  
  const createQueryString = () => {
    const query = new URLSearchParams(searchParams);
    query.set(SEARCH_TYPE_QUERY_KEY, paramValue);
    return query.toString()
  }
  
  const handleSection = () => {
    const url = pathname + '?'
    
    if (paramValue === 'all') {
      return push(pathname)
    }
    
    push(url + createQueryString())
  }
  
  const isActive = (): boolean => {
    if (paramValue === 'all' && !searchParams.get(SEARCH_TYPE_QUERY_KEY)) {
      return true;
    }
    
    return paramValue === searchParams.get(SEARCH_TYPE_QUERY_KEY)
  }
  
  return <NavigationBadge onClick={handleSection} title={title} isActive={isActive()} />
}