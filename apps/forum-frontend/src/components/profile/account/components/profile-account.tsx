import { ProfileAccountSocials } from "./socials/profile-account-socials";
import { ProfileAccountReferals } from "./refs/profile-account-refs";
import { ProfileSectionLayout } from "#components/layout/profile-section-layout";
import { SectionPrivatedContent } from "#components/templates/section-privated-content";
import { ProfileAccountStats } from "./stats/profile-account-stats-list";

export const UserProfileAccount = () => {
  return (
    <ProfileSectionLayout header={<SectionPrivatedContent />}>
      <div className="flex flex-col gap-y-8 w-full h-full">
        <ProfileAccountStats />
        <ProfileAccountSocials />
        <div className="flex flex-col w-full">
          <ProfileAccountReferals />
        </div>
      </div>
    </ProfileSectionLayout>
  );
};