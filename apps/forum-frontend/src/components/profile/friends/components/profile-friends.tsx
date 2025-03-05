import { UserPageParam } from "@repo/types/global";
import { ProfileFriends } from './profile-friends-list';
import { ProfileWrapper } from "#components/wrappers/profile-wrapper";

export const UserProfileFriends = ({ nickname }: UserPageParam) => {
  return (
    <ProfileWrapper>
      <ProfileFriends nickname={nickname} />
    </ProfileWrapper>
  );
};