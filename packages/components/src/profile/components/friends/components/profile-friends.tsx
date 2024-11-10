import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { ProfileFriends } from '#profile/components/friends/components/profile-friends-list.tsx';

export const UserProfileFriends = async({
  nickname,
}: UserPageParam) => {
  return (
    <ProfileSectionLayout>
      <ProfileFriends nickname={nickname} />
    </ProfileSectionLayout>
  );
};