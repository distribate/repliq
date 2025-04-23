import { UserPageParam } from '@repo/types/global';
import { CreatePostSection } from '#components/profile/posts/create-post/create-post-section.tsx';
import {
  ProfilePosts,
} from '#components/profile/posts/posts/components/profile-posts-list.tsx';
import { getUser } from '@repo/lib/helpers/get-user';
import { ProfileWrapper } from '#components/wrappers/components/profile-wrapper';

export const UserProfilePosts = ({
  nickname
}: UserPageParam) => {
  const currentUser = getUser()

  return (
    <ProfileWrapper header={currentUser.nickname === nickname && <CreatePostSection />}>
      <ProfilePosts nickname={nickname} />
    </ProfileWrapper>
  );
};