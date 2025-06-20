import { ProfileAccountSocials } from "./profile-account-socials";
import { SectionPrivatedContent } from "#components/templates/components/section-privated-content";
import { ProfileAccountStats } from "./profile-account-stats-list";
import { ProfileWrapper } from "#components/wrappers/components/profile-wrapper";
import { ProfileAccountIntegrations } from "./profile-account-integrations";

export const UserProfileAccount = () => {
  return (
    <ProfileWrapper header={<SectionPrivatedContent />}>
      <div className="flex flex-col gap-y-8 w-full h-full">
        <ProfileAccountStats />
        <ProfileAccountIntegrations />
        <ProfileAccountSocials />
      </div>
    </ProfileWrapper>
  );
};