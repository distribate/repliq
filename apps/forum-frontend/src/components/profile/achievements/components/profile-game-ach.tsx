import { ProfileGameAch } from "#components/profile/achievements/components/profile-game-ach-list.tsx";
import { ProfileWrapper } from "#components/wrappers/components/profile-wrapper";
import { onConnect } from "@reatom/framework";
import { achievementsAction } from "../models/achievements.model";

onConnect(achievementsAction, achievementsAction)

export const UserProfileGameAchievements = () => {
  return (
    <ProfileWrapper>
      <ProfileGameAch />
    </ProfileWrapper>
  );
};