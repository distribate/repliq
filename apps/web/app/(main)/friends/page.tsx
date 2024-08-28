import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Tabs, TabsContent } from '@repo/ui/src/components/tabs.tsx';
import { REQUESTS_INCOMING_QUERY_KEY } from '@repo/components/src/friends/queries/requests-incoming-query.ts';
import { getIncomingRequests } from '@repo/components/src/friends/queries/get-incoming-requests.ts';
import { REQUESTS_QUERY_KEY } from '@repo/components/src/friends/queries/requests-query.ts';
import { getRequests } from '@repo/components/src/friends/queries/get-requests.ts';
import { REQUESTS_OUTGOING_QUERY_KEY } from '@repo/components/src/friends/queries/requests-outgoing-query.ts';
import { getOutgoingRequests } from '@repo/components/src/friends/queries/get-outgoing-requests.ts';
import { ReactNode, Suspense } from 'react';
import { FriendsFiltering } from '@repo/components/src/friends/components/control/components/friends-filtering.tsx';
import {
  FriendsAllListSkeleton
} from '@repo/components/src/friends/components/lists/components/friends-all-list-skeleton.tsx';
import { FriendsAllList } from '@repo/components/src/friends/components/lists/components/friends-all-list.tsx';
import {
  FriendsIncomingList
} from '@repo/components/src/friends/components/lists/components/friends-incoming-list.tsx';
import {
  FriendsOutgoingList
} from '@repo/components/src/friends/components/lists/components/friends-outgoing-list.tsx';
import {
  FriendsSearchingList
} from '@repo/components/src/friends/components/lists/components/friends-searching-list.tsx';
import { FriendsControl } from '@repo/components/src/friends/components/control/components/friends-control.tsx';
import { FriendsStatistics } from '@repo/components/src/friends/components/control/components/friends-statistics.tsx';

type FriendsLayout = {
  children: ReactNode
}

const FriendsLayout = ({
  children
}: FriendsLayout) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <FriendsFiltering />
      {children}
    </div>
  );
};

export default async function FriendsPage() {
  const qc = new QueryClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  const nickname = currentUser.nickname;
  
  await Promise.all([
    qc.prefetchQuery({
      queryKey: REQUESTS_INCOMING_QUERY_KEY(nickname),
      queryFn: () => getIncomingRequests(nickname),
    }),
    qc.prefetchQuery({
      queryKey: REQUESTS_QUERY_KEY(nickname),
      queryFn: () => getRequests(nickname),
    }),
    qc.prefetchQuery({
      queryKey: REQUESTS_OUTGOING_QUERY_KEY(nickname),
      queryFn: () => getOutgoingRequests(nickname),
    }),
  ]);
  
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Tabs
        defaultValue="all-friends-list"
        className="flex flex-col gap-4 items-start lg:flex-row w-full h-full relative"
      >
        <div className="flex w-2/3 *:w-full">
          <TabsContent value="all-friends-list">
            <Suspense fallback={<FriendsAllListSkeleton />}>
              <FriendsLayout>
                <FriendsAllList nickname={nickname}/>
              </FriendsLayout>
            </Suspense>
          </TabsContent>
          <TabsContent value="incoming-friends-list">
            <Suspense fallback={<FriendsAllListSkeleton />}>
              <FriendsLayout>
                <FriendsIncomingList />
              </FriendsLayout>
            </Suspense>
          </TabsContent>
          <TabsContent value="outgoing-friends-list">
            <Suspense fallback={<FriendsAllListSkeleton />}>
              <FriendsLayout>
                <FriendsOutgoingList />
              </FriendsLayout>
            </Suspense>
          </TabsContent>
          <TabsContent value="searching-friends-list">
            <Suspense fallback={<FriendsAllListSkeleton />}>
              <FriendsSearchingList />
            </Suspense>
          </TabsContent>
        </div>
        <div className="flex flex-col gap-4 w-1/3">
          <FriendsControl nickname={nickname} />
          <FriendsStatistics />
        </div>
      </Tabs>
    </HydrationBoundary>
  );
}