'use client';

import { Separator } from '@repo/ui/src/components/separator.tsx';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { SidebarDesktopSkeleton } from './sidebar-desktop-skeleton.tsx';
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
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { UserMenu } from '#sidebar/desktop/components/sidebar-content/user-menu/user-menu.tsx';

type SidebarLayoutVariant = Exclude<SidebarFormat, 'dynamic'>

const SearchArea = dynamic(() =>
  import('../sidebar-content/search/components/search-area.tsx')
  .then(m => m.SearchArea),
);

const UserMenuTrigger = () => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const { isExpanded, isCompact } = useSidebarControl();
  
  return (
    <DropdownWrapper
      trigger={
        <div
          className={`flex gap-x-3 items-center hover:bg-shark-800 rounded-md w-full
					${!isCompact ? 'justify-start' : isExpanded ? 'justify-start' : 'justify-center'}`}
        >
          <Avatar
            variant="default"
            border="withBorder"
            className="overflow-hidden min-w-[48px] min-h-[48px]"
            propWidth={48}
            propHeight={48}
            nickname={currentUser.nickname}
          />
          {!isCompact && (
            <div className="flex flex-col items-start max-w-[200px] overflow-hidden">
              <UserNickname
                className="text-base truncate"
                nicknameColor={currentUser.name_color}
                nickname={currentUser.nickname}
              />
              <UserDonate nickname={currentUser.nickname}/>
            </div>
          )}
        </div>
      }
      content={<UserMenu/>}
    />
  )
}

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