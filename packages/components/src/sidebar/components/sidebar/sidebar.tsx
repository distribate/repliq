'use client';

import { Separator } from '@repo/ui/src/components/separator.tsx';
import { SidebarLayout } from '../sidebar-layout/components/sidebar-layout.tsx';
import { SearchInput } from '../sidebar-content/search-area/components/search-input.tsx';
import { SidebarFormat, sidebarLayoutQuery } from '../sidebar-layout/queries/sidebar-layout-query.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { SidebarSkeleton } from './sidebar-skeleton.tsx';
import { SavedThreads } from '../sidebar-content/saved-threads/saved-threads.tsx';
import { UserMenuTrigger } from '../sidebar-content/user-menu/user-menu-trigger.tsx';
import { SidebarLogotype } from '../sidebar-content/logotype/sidebar-logotype.tsx';
import { useSidebarControl } from '../sidebar-layout/hooks/use-sidebar-control.ts';
import { CreateThread } from '../sidebar-content/create-thread/create-thread.tsx';
import { searchQuery } from '../sidebar-content/search-area/queries/search-query.ts';
import { SidebarSettings } from '../sidebar-settings/components/sidebar-settings.tsx';
import { SidebarTarget } from '../sidebar-content/targets/components/sidebar-target.tsx';
import dynamic from 'next/dynamic';

type SidebarLayoutVariant = Exclude<
  SidebarFormat, 'dynamic'
>

const SearchArea = dynamic(() =>
  import("../sidebar-content/search-area/components/search-area.tsx")
  .then(m => m.SearchArea)
)

export const Sidebar = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { data: currentUser, isLoading } = currentUserQuery();
  const { isExpanded, isDynamic, isCompact } = useSidebarControl();
  const { data: searched } = searchQuery();
  
  const sidebarLayoutVariant = isDynamic
    ? 'default'
    : sidebarState.format as SidebarLayoutVariant;
  
  if (isLoading || !currentUser) return <SidebarSkeleton />;
  
  return (
    <SidebarLayout
      variant={sidebarLayoutVariant}
      padding={!isExpanded ? 'medium' : 'small'}
    >
      <div className="flex flex-col gap-y-4 items-center justify-center">
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
            <SavedThreads />
            <SidebarTarget />
          </>
        )}
      </div>
      <SidebarSettings />
    </SidebarLayout>
  );
};