import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { CreatePostSection } from '#profile/components/posts/components/create-post/create-post-section.tsx';
import {
  ProfilePosts,
} from '#profile/components/posts/components/posts/components/profile-posts-list.tsx';
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