import { ProfileAccountSocials } from "./socials/profile-account-socials";
import { ProfileAccountReferals } from "./refs/profile-account-refs";
import { SectionPrivatedContent } from "#components/templates/section-privated-content";
import { ProfileAccountStats } from "./stats/profile-account-stats-list";
import { ProfileWrapper } from "#components/wrappers/profile-wrapper";

export const UserProfileAccount = () => {
  return (
    <ProfileWrapper header={<SectionPrivatedContent />}>
      <div className="flex flex-col gap-y-8 w-full h-full">
        <ProfileAccountStats />
        <ProfileAccountSocials />
        <div className="flex flex-col w-full">
          <ProfileAccountReferals />
        </div>
      </div>
    </ProfileWrapper>
  );
};