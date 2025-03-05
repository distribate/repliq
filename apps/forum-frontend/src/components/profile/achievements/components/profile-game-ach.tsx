import { UserPageParam } from "@repo/types/global";
import { ProfileGameAch } from "#components/profile/achievements/components/profile-game-ach-list.tsx";
import { ProfileWrapper } from "#components/wrappers/profile-wrapper";

export const UserProfileGameAchievements = ({
  nickname,
}: UserPageParam) => {
  return (
    <ProfileWrapper>
      <ProfileGameAch nickname={nickname} />
    </ProfileWrapper>
  );
};
