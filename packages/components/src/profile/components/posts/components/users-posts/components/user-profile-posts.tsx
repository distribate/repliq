import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Suspense } from 'react';
import { protectPrivateArea } from '@repo/lib/helpers/protect-private-area.ts';
import { getCreatorPost } from '../queries/get-creator-post.ts';
import { getPostsByNickname } from '../../posts/queries/get-posts-by-user.ts';
import { POSTS_QUERY_KEY } from '../../posts/queries/posts-query.ts';
import { UserPostsSkeleton } from '#skeletons/user-posts-skeleton.tsx';
import { Posts } from '../../posts/components/posts.tsx';
import { CreatePostSection } from '../../create-post/create-post-section.tsx';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';

export const UserProfilePosts = async({
  nickname,
}: UserPageParam) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const qc = new QueryClient();
  
  await qc.prefetchQuery({
    queryKey: POSTS_QUERY_KEY(nickname),
    queryFn: () => getPostsByNickname({
      nickname, limit: 10
    }),
  });
  
  const [ isOwner, creatorPost ] = await Promise.all([
    protectPrivateArea(nickname),
    getCreatorPost(nickname),
  ]);
  
  return (
    <ProfileSectionLayout
      header={
        (currentUser && isOwner) && <CreatePostSection />
      }
    >
      <Suspense fallback={<UserPostsSkeleton />}>
        <HydrationBoundary state={dehydrate(qc)}>
          <Posts nickname={creatorPost.nickname} name_color={creatorPost.name_color} />
        </HydrationBoundary>
      </Suspense>
    </ProfileSectionLayout>
  );
};