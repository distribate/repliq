import { ProfileSectionLayout } from '#layouts/profile-section-layout.tsx';
import { SectionPrivatedContent } from '#templates/section-privated-content.tsx';

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