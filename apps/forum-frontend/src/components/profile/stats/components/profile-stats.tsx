import { SectionPrivatedContent } from "#components/templates/components/section-privated-content";
import { GeneralStats } from "./general-stats";
import { LandsStats } from "./lands-stats";
import { ProfileWrapper } from "#components/wrappers/components/profile-wrapper";
import { Typography } from "@repo/ui/src/components/typography";
import { requestedUserSectionIsPrivatedAtom } from "#components/profile/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";

export const UserProfileGameStats = reatomComponent(({ ctx }) => {
  const isSectionPrivated = ctx.spy(requestedUserSectionIsPrivatedAtom)

  return (
    <ProfileWrapper header={isSectionPrivated && <SectionPrivatedContent />}>
      <div className="flex flex-col gap-6 w-full h-full">
        <div className="flex flex-col gap-4 w-full">
          <Typography textSize="large" className="font-semibold">
            Основная статистика
          </Typography>
          <GeneralStats />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Typography textSize="large" className="font-semibold">
            Территории
          </Typography>
          <LandsStats />
        </div>
      </div>
    </ProfileWrapper>
  );
}, "UserProfileGameStats")