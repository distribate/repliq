import { protectPrivateArea } from '@repo/lib/helpers/protect-private-area.ts';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { CreatePostSection } from '#profile/components/posts/components/create-post/create-post-section.tsx';
import {
  ProfilePosts,
} from '#profile/components/posts/components/posts/components/profile-posts-list.tsx';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

export const UserProfilePosts = async ({
  nickname
}: UserPageParam) => {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const isOwner = await protectPrivateArea(nickname);

  return (
    <ProfileSectionLayout
      header={currentUser && isOwner && <CreatePostSection />}
    >
      <ProfilePosts nickname={nickname} />
    </ProfileSectionLayout>
  );
};