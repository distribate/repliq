import { UserPageParam } from '@repo/types/config/page-types.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { FriendsList } from './components/friends-list.tsx';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { REQUESTS_INCOMING_QUERY_KEY } from '../../../friends/queries/requests-incoming-query.ts';
import { getIncomingRequests } from '../../../friends/queries/get-incoming-requests.ts';
import { REQUESTS_QUERY_KEY } from '../../../friends/queries/requests-query.ts';
import { getRequests } from '../../../friends/queries/get-requests.ts';
import { REQUESTS_OUTGOING_QUERY_KEY } from '../../../friends/queries/requests-outgoing-query.ts';
import { getOutgoingRequests } from '../../../friends/queries/get-outgoing-requests.ts';

export const UserProfileFriends = async({
  nickname,
}: UserPageParam) => {
  const qc = new QueryClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return null;
  
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
    <div className="flex flex-col w-full gap-6">
      <Separator orientation="horizontal" />
      <HydrationBoundary state={dehydrate(qc)}>
        <FriendsList nickname={nickname} />
      </HydrationBoundary>
    </div>
  );
};