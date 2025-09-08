import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs"
import { AccountStatsMonthlyCharts } from "./account-monthly-charts"
import { AccountStatsDailyCharts } from "./account-daily-charts"
import { Typography } from "@repo/ui/src/components/typography"
import { ProfileStatsCharts } from "@repo/types/routes-types/get-user-profile-stats-types"

export type AccountStatsChartsProps = {
  charts: ProfileStatsCharts
}

export const AccountStatsCharts = ({
  charts
}: AccountStatsChartsProps) => {
  return (
    <Tabs defaultValue="daily" className="flex flex-col gap-4 h-full w-full">
      <TabsContent value="monthly">
        <AccountStatsMonthlyCharts charts={charts} />
      </TabsContent>
      <TabsContent value="daily">
        <AccountStatsDailyCharts charts={charts} />
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