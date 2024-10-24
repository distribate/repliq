"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@repo/ui/src/components/button.tsx';
import { USERS_QUERY_KEY } from './dashboard-users-list.tsx';

type DashboardUsersListPaginationProps = {
  length: number | null
}

export const DashboardUsersListPagination = ({
  length
}: DashboardUsersListPaginationProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  
  if (!length) return;
  
  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    
    return params.toString();
  }, [ searchParams ]);
  
  const buttonsLength = Math.floor(length / 6) + 1;
  
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: buttonsLength }).map((_, i) => (
        <Button
          key={i}
          onClick={() => push(pathname + '?' + createQueryString(USERS_QUERY_KEY, i.toString()))}
          state="default"
          className="flex items-center justify-center p-1 hover:brightness-75 w-8 h-8"
        >
          <span className="font-semibold">
            {i}
          </span>
        </Button>
      ))}
    </div>
  );
};