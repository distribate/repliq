'use client';

import { Separator } from '@repo/ui/src/components/separator.tsx';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { SidebarDesktopSkeleton } from './sidebar-desktop-skeleton.tsx';
import { UserMenuTrigger } from '../sidebar-content/user-menu/user-menu-trigger.tsx';
import { CreateThread } from '../sidebar-content/create-thread/create-thread.tsx';
import { SidebarLogotype } from '../sidebar-content/logotype/sidebar-logotype.tsx';
import { searchQuery } from '../sidebar-content/search/queries/search-query.ts';
import { SearchInput } from '../sidebar-content/search/components/search-input.tsx';
import { HistoryThreads } from '../sidebar-content/history-threads/history-threads.tsx';
import { SidebarTarget } from '../sidebar-content/links/components/sidebar-target.tsx';
import { useSidebarControl } from '../sidebar-layout/hooks/use-sidebar-control.ts';
import { SidebarFormat, sidebarLayoutQuery } from '../sidebar-layout/queries/sidebar-layout-query.ts';
import { SidebarLayout } from '../sidebar-layout/components/sidebar-layout.tsx';
import dynamic from 'next/dynamic';

type SidebarLayoutVariant = Exclude<SidebarFormat, 'dynamic'>

const SearchArea = dynamic(() =>
  import('../sidebar-content/search/components/search-area.tsx')
  .then(m => m.SearchArea),
);

const SidebarDesktopContent = () => {
  const { data: searchState } = searchQuery();
  
  return searchState.queryValue ? <SearchArea /> : (
    <>
      <HistoryThreads />
      <SidebarTarget />
    </>
  );
};

export const SidebarDesktop = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { isLoading } = currentUserQuery();
  const { isExpanded, isDynamic, isCompact } = useSidebarControl();
  
  if (isLoading) return <SidebarDesktopSkeleton />;
  
  const sidebarLayoutVariant = isDynamic
    ? 'default' : sidebarState.format as SidebarLayoutVariant;
  
  return (
    <SidebarLayout
      variant={sidebarLayoutVariant}
      padding={!isCompact && isExpanded ? 'big' : isCompact ? 'small' : 'medium'}
    >
      <div className="biloba-gradient opacity-30 w-full h-[160px] z-[1] absolute left-0 right-0 top-0" />
      <div className="flex flex-col gap-y-4 items-center z-[2] h-full justify-start w-full">
        <SidebarLogotype />
        {!isCompact && isExpanded && <SearchInput />}
        <Separator />
        <UserMenuTrigger />
        <Separator orientation="horizontal" />
        <CreateThread />
        <Separator orientation="horizontal" />
        <SidebarDesktopContent/>
      </div>
    </SidebarLayout>
  );
};