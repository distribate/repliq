import { SectionPrivatedContent } from '../../../templates/section-privated-content.tsx';
import { ProfileSectionLayout } from '../../../layouts/profile-section-layout.tsx';

export const UserProfileAccountStats = async() => {
  return (
    <ProfileSectionLayout
      header={
        <SectionPrivatedContent />
      }
    >
      Account stats
    </ProfileSectionLayout>
  );
};