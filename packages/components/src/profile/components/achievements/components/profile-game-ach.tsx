import { UserPageParam } from "@repo/types/global";
import { ProfileSectionLayout } from "#layouts/profile-section-layout.tsx";
import { ProfileGameAch } from "#profile/components/achievements/components/profile-game-ach-list.tsx";

export const UserProfileGameAchievements = async ({
  nickname,
}: UserPageParam) => {
  return (
    <ProfileSectionLayout>
      <ProfileGameAch nickname={nickname} />
    </ProfileSectionLayout>
  );
};
