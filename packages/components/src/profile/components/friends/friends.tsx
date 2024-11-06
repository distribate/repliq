import { Friends } from './components/friends-list.tsx';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { REQUESTS_QUERY_KEY } from '#friends/queries/requests-query.ts';
import { getRequests } from '#friends/queries/get-requests.ts';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { FRIENDS_QUERY_KEY } from '#friends/queries/friends-query.ts';
import { getFriends } from '#friends/queries/get-friends.ts';

export const UserProfileFriends = async({
  nickname,
}: UserPageParam) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const qc = new QueryClient();
  
  await qc.prefetchQuery({
    queryKey: FRIENDS_QUERY_KEY(nickname),
    queryFn: () => getFriends({ nickname, orderType: "created_at" }),
  })
  
  return (
    <ProfileSectionLayout>
      <HydrationBoundary state={dehydrate(qc)}>
        <Friends nickname={nickname} />
      </HydrationBoundary>
    </ProfileSectionLayout>
  );
};