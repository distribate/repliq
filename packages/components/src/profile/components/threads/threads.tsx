import { ThreadsList } from './components/threads-list.tsx';
import { ProfileSectionLayout } from '../../../layouts/profile-section-layout.tsx';
import { UserPageParam } from '@repo/types/global';

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