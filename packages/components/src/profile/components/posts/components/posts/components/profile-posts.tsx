import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Suspense } from 'react';
import { protectPrivateArea } from '@repo/lib/helpers/protect-private-area.ts';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { POSTS_QUERY_KEY } from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { getPostsByNickname } from '#profile/components/posts/components/posts/queries/get-posts-by-user.ts';
import { CreatePostSection } from '#profile/components/posts/components/create-post/create-post-section.tsx';
import { UserPostsSkeleton } from '#skeletons/user-posts-skeleton.tsx';
import { ProfilePostsList } from '#profile/components/posts/components/posts/components/profile-posts-list.tsx';

export const ProfilePosts = async({
  nickname,
}: UserPageParam) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const qc = new QueryClient();
  
  await qc.prefetchQuery({
    queryKey: POSTS_QUERY_KEY(nickname),
    queryFn: () => getPostsByNickname({ nickname, limit: 10 }),
  });
  
  const isOwner = await protectPrivateArea(nickname);
  const dehydratedState = dehydrate(qc);
  
  return (
    <ProfileSectionLayout
      header={
        (currentUser && isOwner) && <CreatePostSection />
      }
    >
      <HydrationBoundary state={dehydratedState}>
        <ProfilePostsList nickname={nickname} />
      </HydrationBoundary>
    </ProfileSectionLayout>
  );
};