import { ProfileSectionLayout } from '#components/layout/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { CreatePostSection } from '#components/profile/posts/create-post/create-post-section.tsx';
import {
  ProfilePosts,
} from '#components/profile/posts/posts/components/profile-posts-list.tsx';
import { getUser } from '@repo/lib/helpers/get-user';

export const UserProfilePosts = ({
  nickname
}: UserPageParam) => {
  const currentUser = getUser()
  const isOwner = currentUser.nickname === nickname

  return (
    <ProfileSectionLayout header={isOwner && <CreatePostSection />}>
      <ProfilePosts nickname={nickname} />
    </ProfileSectionLayout>
  );
};