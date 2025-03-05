import { UserPageParam } from '@repo/types/global';
import { ProfileThreads } from '#components/profile/threads/components/profile-threads-list.tsx';
import { ProfileThreadsSkeleton } from '#components/profile/threads/components/profile-threads-skeleton.tsx';
import { Suspense } from 'react';
import { ProfileWrapper } from '#components/wrappers/profile-wrapper';

export const UserProfileThreads = ({ nickname }: UserPageParam) => {
  return (
    <Suspense fallback={<ProfileThreadsSkeleton />}>
      <ProfileWrapper>
        <ProfileThreads nickname={nickname} />
      </ProfileWrapper>
    </Suspense>
  )
};