import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { REQUESTS_INCOMING_QUERY_KEY } from '@repo/components/src/friends/queries/requests-incoming-query.ts';
import { REQUESTS_QUERY_KEY } from '@repo/components/src/friends/queries/requests-query.ts';
import { getRequests } from '@repo/components/src/friends/queries/get-requests.ts';
import { REQUESTS_OUTGOING_QUERY_KEY } from '@repo/components/src/friends/queries/requests-outgoing-query.ts';
import { Suspense } from 'react';
import {
  FriendsAllListSkeleton,
} from '@repo/components/src/friends/components/lists/components/friends-all-list-skeleton.tsx';
import { FilteringSearch } from '@repo/components/src/filtering/components/filtering-search.tsx';
import { FriendsSearch } from '@repo/components/src/profile/components/friends/components/friends-search.tsx';
import {
  FriendsFilteringView,
} from '@repo/components/src/friends/components/filtering/components/friends-filtering-view.tsx';
import { FriendsSort } from '@repo/components/src/profile/components/friends/components/friends-sort.tsx';
import { FriendsList } from '@repo/components/src/friends/components/lists/components/friends-list.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { FriendsTab } from '@repo/components/src/friends/components/control/components/friends-tab.tsx';
import { getRequestsByType } from '@repo/components/src/friends/queries/get-requests-by-type.ts';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import {
  FriendsAllCountIndicator, FriendsIncomingRequestsIndicator, FriendsOutgoingRequstsIndicator,
} from '@repo/components/src/friends/components/control/components/friends-indicators.tsx';

export default async function FriendsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const nickname = currentUser.nickname;
  
  const qc = new QueryClient();
  
  await Promise.all([
    qc.prefetchQuery({
      queryKey: REQUESTS_INCOMING_QUERY_KEY(nickname),
      queryFn: () => getRequestsByType({
        type: 'incoming', nickname: currentUser?.nickname,
      }),
    }),
    qc.prefetchQuery({
      queryKey: REQUESTS_QUERY_KEY(nickname),
      queryFn: () => getRequests(nickname),
    }),
    qc.prefetchQuery({
      queryKey: REQUESTS_OUTGOING_QUERY_KEY(nickname),
      queryFn: () => getRequestsByType({
        type: 'outgoing', nickname: currentUser?.nickname,
      }),
    }),
  ]);
  
  const dehydratedClient = dehydrate(qc);
  
  return (
    <div className="flex flex-col gap-2 items-start lg:flex-row w-full h-full relative">
      <HydrationBoundary state={dehydratedClient}>
        <BlockWrapper className="flex w-4/6 *:w-full !p-4 h-full">
          <div className="flex flex-col w-full h-full gap-4">
            <div className="flex items-center gap-4">
              <FilteringSearch>
                <FriendsSearch />
              </FilteringSearch>
              <FriendsFilteringView />
              <FriendsSort />
            </div>
            <Suspense fallback={<FriendsAllListSkeleton />}>
              <FriendsList nickname={nickname} />
            </Suspense>
          </div>
        </BlockWrapper>
        <div className="flex flex-col gap-4 w-2/6 sticky top-0 h-fit">
          <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
            <FriendsTab type="all" title="Мои друзья">
              <FriendsAllCountIndicator nickname={nickname} />
            </FriendsTab>
            <FriendsTab type="incoming" title="Входящие заявки">
              <FriendsIncomingRequestsIndicator />
            </FriendsTab>
            <FriendsTab type="outgoing" title="Исходящие заявки">
              <FriendsOutgoingRequstsIndicator />
            </FriendsTab>
            <Separator />
            <FriendsTab type="search" title="Поиск друзей" />
          </BlockWrapper>
          {/*<FriendsStatistics />*/}
        </div>
      </HydrationBoundary>
    </div>
  );
}