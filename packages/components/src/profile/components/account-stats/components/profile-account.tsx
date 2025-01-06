import { ProfileSectionLayout } from "#layouts/profile-section-layout.tsx";
import { SectionPrivatedContent } from "#templates/section-privated-content.tsx";
import { ProfileAccountStats } from "#profile/components/account-stats/components/profile-account-stats-list.tsx";
import { ProfileAccountSocials } from "./profile-account-socials";

export const UserProfileAccount = () => {
  return (
    <ProfileSectionLayout header={<SectionPrivatedContent />}>
      <div className="flex flex-col gap-y-6 w-full h-full">
        <ProfileAccountStats />
        <ProfileAccountSocials />
      </div>
    </ProfileSectionLayout>
  );
};
