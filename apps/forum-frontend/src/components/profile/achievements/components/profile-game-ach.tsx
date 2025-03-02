import { UserPageParam } from "@repo/types/global";
import { ProfileSectionLayout } from '#components/layout/profile-section-layout.tsx';
import { ProfileGameAch } from "#components/profile/achievements/components/profile-game-ach-list.tsx";

export const UserProfileGameAchievements = ({
  nickname,
}: UserPageParam) => {
  return (
    <ProfileSectionLayout>
      <ProfileGameAch nickname={nickname} />
    </ProfileSectionLayout>
  );
};
