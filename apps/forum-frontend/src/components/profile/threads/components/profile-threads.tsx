import { UserPageParam } from '@repo/types/global';
import { ProfileThreads } from '#components/profile/threads/components/profile-threads-list.tsx';
import { ProfileWrapper } from '#components/wrappers/components/profile-wrapper';

export const UserProfileThreads = ({ nickname }: UserPageParam) => {
  return (
    <ProfileWrapper>
      <ProfileThreads nickname={nickname} />
    </ProfileWrapper>
  )
};