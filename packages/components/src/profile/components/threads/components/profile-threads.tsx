import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';
import { ProfileThreadsList } from '#profile/components/threads/components/profile-threads-list.tsx';

export const UserProfileThreads = async({
  nickname
}: UserPageParam) => {
  return (
    <ProfileSectionLayout>
      <ProfileThreadsList nickname={nickname} />
    </ProfileSectionLayout>
  );
};