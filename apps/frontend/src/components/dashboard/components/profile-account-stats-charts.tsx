import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs"
import { ProfileAccountStatsMonthlyCharts } from "./profile-account-monthly-charts"
import { ProfileAccountStatsDailyCharts } from "./profile-account-daily-charts"
import { Typography } from "@repo/ui/src/components/typography"
import { ProfileStatsCharts } from "@repo/types/routes-types/get-user-profile-stats-types"

export type ProfileAccountStatsChartsProps = {
  charts: ProfileStatsCharts
}

export const ProfileAccountStatsCharts = ({
  charts
}: ProfileAccountStatsChartsProps) => {
  return (
    <Tabs defaultValue="daily" className="flex flex-col gap-4 h-full w-full">
      <TabsContent value="monthly">
        <ProfileAccountStatsMonthlyCharts charts={charts} />
      </TabsContent>
      <TabsContent value="daily">
        <ProfileAccountStatsDailyCharts charts={charts} />
      </TabsContent>
      <TabsList>
        <TabsTrigger value="daily">
          <Typography>За сутки</Typography>
        </TabsTrigger>
        <TabsTrigger value="monthly">
          <Typography>За месяц</Typography>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}