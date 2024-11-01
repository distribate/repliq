import { FriendsList } from './components/friends-list.tsx';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { REQUESTS_QUERY_KEY } from '#friends/queries/requests-query.ts';
import { getRequests } from '#friends/queries/get-requests.ts';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';

export const UserProfileFriends = async({
  nickname,
}: UserPageParam) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const qc = new QueryClient();
  
  await Promise.all([
    qc.prefetchQuery({
      queryKey: REQUESTS_QUERY_KEY(nickname),
      queryFn: () => getRequests(nickname),
    }),
  ]);
  
  return (
    <ProfileSectionLayout>
      <HydrationBoundary state={dehydrate(qc)}>
        <FriendsList nickname={nickname} />
      </HydrationBoundary>
    </ProfileSectionLayout>
  );
};