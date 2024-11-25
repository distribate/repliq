"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NavigationBadge } from '#navigation/components/navigation-badge.tsx';

export type AdminSections = "reports" | "tickets" | "configs" | "main" | "stats"

const SECTION_QUERY_KEY = "section"

type AdminNavigationBadgeProps = {
  title: string,
  paramValue: AdminSections
}

export const AdminNavigationBadge = ({
  title, paramValue
}: AdminNavigationBadgeProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  
  const createQueryString = () => {
    const query = new URLSearchParams(searchParams);
    query.set(SECTION_QUERY_KEY, paramValue);
    return query.toString()
  }
  
  const handleSection = () => {
    const url = pathname + '?'
    
    if (paramValue === 'main') {
      return push(pathname)
    }
    
    push(url + createQueryString())
  }
  
  const isActive = (): boolean => {
    if (paramValue === 'main' && !searchParams.get(SECTION_QUERY_KEY)) {
      return true;
    }
    
    return paramValue === searchParams.get(SECTION_QUERY_KEY)
  }
  
  return <NavigationBadge onClick={handleSection} isActive={isActive()} title={title}/>
}