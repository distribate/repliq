import { UserPageParam } from '@repo/types/config/page-types.ts';
import { ThreadsList } from './components/threads-list.tsx';
import { ProfileSectionLayout } from '../../../layouts/profile-section-layout.tsx';

export const UserProfileThreads = ({
  nickname
}: UserPageParam) => {
  if (!nickname) return;
  
  return (
    <ProfileSectionLayout>
      <ThreadsList nickname={nickname} />
    </ProfileSectionLayout>
  );
};