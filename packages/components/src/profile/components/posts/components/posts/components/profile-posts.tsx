import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { protectPrivateArea } from '@repo/lib/helpers/protect-private-area.ts';
import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { CreatePostSection } from '#profile/components/posts/components/create-post/create-post-section.tsx';
import { ProfilePostsList } from '#profile/components/posts/components/posts/components/profile-posts-list.tsx';

export const ProfilePosts = async({
  nickname,
}: UserPageParam) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  const isOwner = await protectPrivateArea(nickname);

  return (
    <ProfileSectionLayout
      header={
        (currentUser && isOwner) && <CreatePostSection />
      }
    >
      <ProfilePostsList nickname={nickname} />
    </ProfileSectionLayout>
  );
};