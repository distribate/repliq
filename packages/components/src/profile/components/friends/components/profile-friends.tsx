import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { FRIENDS_QUERY_KEY } from '#friends/queries/friends-query.ts';
import { getFriends } from '#friends/queries/get-friends.ts';
import { ProfileFriends } from '#profile/components/friends/components/profile-friends-list.tsx';

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
        <ProfileFriends nickname={nickname} />
      </HydrationBoundary>
    </ProfileSectionLayout>
  );
};