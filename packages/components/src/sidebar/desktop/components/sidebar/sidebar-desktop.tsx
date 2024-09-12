'use client';

import { Separator } from '@repo/ui/src/components/separator.tsx';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { SidebarDesktopSkeleton } from './sidebar-desktop-skeleton.tsx';
import { UserMenuTrigger } from '../sidebar-content/user-menu/user-menu-trigger.tsx';
import { CreateThread } from '../sidebar-content/create-thread/create-thread.tsx';
import dynamic from 'next/dynamic';
import { SidebarLogotype } from '../sidebar-content/logotype/sidebar-logotype.tsx';
import { searchQuery } from '../sidebar-content/search/queries/search-query.ts';
import { SearchInput } from '../sidebar-content/search/components/search-input.tsx';
import { HistoryThreads } from '../sidebar-content/history-threads/history-threads.tsx';
import { SidebarTarget } from '../sidebar-content/links/components/sidebar-target.tsx';
import { useSidebarControl } from '../sidebar-layout/hooks/use-sidebar-control.ts';
import { SidebarFormat, sidebarLayoutQuery } from '../sidebar-layout/queries/sidebar-layout-query.ts';
import { SidebarSettings } from '../sidebar-settings/components/sidebar-settings.tsx';
import { SidebarLayout } from '../sidebar-layout/components/sidebar-layout.tsx';

type SidebarLayoutVariant = Exclude<SidebarFormat, 'dynamic'>

const SearchArea = dynamic(() =>
  import('../sidebar-content/search/components/search-area.tsx')
  .then(m => m.SearchArea),
);

export const SidebarDesktop = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { data: currentUser, isLoading } = currentUserQuery();
  const { isExpanded, isDynamic, isCompact } = useSidebarControl();
  const { data: searched } = searchQuery();
  
  const sidebarLayoutVariant = isDynamic
    ? 'default' : sidebarState.format as SidebarLayoutVariant;
  
  if (isLoading || !currentUser) return <SidebarDesktopSkeleton />;
  
  return (
    <SidebarLayout
      variant={sidebarLayoutVariant}
      padding={!isCompact && isExpanded ? 'big' : isCompact ? 'small' : 'medium'}
    >
      <div
        className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
          from-biloba-flower-500 via-biloba-flower-500/30 to-transparent opacity-30 w-full h-[160px] z-[1] absolute left-0 right-0 top-0"
      />
      <div className="flex flex-col gap-y-4 items-center z-[2] justify-center w-full">
        <SidebarLogotype />
        {!isCompact && isExpanded && (
          <SearchInput />
        )}
        <Separator />
        <UserMenuTrigger />
        <Separator orientation="horizontal" />
        <CreateThread />
        <Separator orientation="horizontal" />
        {searched.results?.length ? (
          <SearchArea />
        ) : (
          <>
            <HistoryThreads />
            <SidebarTarget />
          </>
        )}
      </div>
      <SidebarSettings />
    </SidebarLayout>
  );
}