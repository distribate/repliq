import { ProfileSectionLayout } from "#layouts/profile-section-layout.tsx";
import { SectionPrivatedContent } from "#templates/section-privated-content.tsx";
import { ProfileAccountStats } from "#profile/components/account-stats/components/profile-account-stats-list.tsx";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export const UserProfileAccountStats = async () => {
  const { user } = await getCurrentSession();
  if (!user) return null;

  const { nickname } = user;

  return (
    <ProfileSectionLayout header={<SectionPrivatedContent />}>
      <ProfileAccountStats nickname={nickname} />
    </ProfileSectionLayout>
  );
};
