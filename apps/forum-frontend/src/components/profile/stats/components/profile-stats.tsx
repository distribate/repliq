import { GeneralStats } from "./general-stats";
import { LandsStats } from "./lands-stats";
import { Typography } from "@repo/ui/src/components/typography";
import { reatomComponent } from "@reatom/npm-react";

export const UserProfileGameStats = reatomComponent(({ ctx }) => {
  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full">
        <div className="flex flex-col gap-4 w-full">
          <Typography textColor="shark_white" textSize="big" className="font-semibold" >
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
    </>
  );
}, "UserProfileGameStats")