import { UserPageParam } from "@repo/types/global";
import { ProfileFriends } from './profile-friends-list';
import { ProfileSectionLayout } from "#components/layout/profile-section-layout";

export const UserProfileFriends = ({ nickname }: UserPageParam) => {
  return (
    <ProfileSectionLayout>
      <ProfileFriends nickname={nickname} />
    </ProfileSectionLayout>
  );
};