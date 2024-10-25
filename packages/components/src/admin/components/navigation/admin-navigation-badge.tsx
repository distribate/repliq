"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@repo/ui/src/components/typography.tsx';

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
  
  return (
    <div
      onClick={handleSection}
      data-state={isActive() ? 'active' : 'disabled'}
      className="flex items-center duration-150 ease-in data-[state=active]:bg-shark-50/80
       data-[state=disabled]:bg-shark-900/80 backdrop-filter-lg group cursor-pointer justify-center px-6 py-1 rounded-[18px]"
    >
      <Typography className="duration-150 group-hover:duration-150 group-data-[state=active]:text-black font-medium text-[18px]">
        {title}
      </Typography>
    </div>
  )
}