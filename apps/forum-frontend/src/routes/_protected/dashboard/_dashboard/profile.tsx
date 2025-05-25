import { ProfileAccountStatsCharts } from '#components/profile/account/components/stats/profile-account-stats-charts'
import { ProfileAccountStatsMeta, ProfileAccountStatsPlayers } from '#components/profile/account/components/stats/profile-account-stats-list'
import { userProfileStatsResource } from '#components/profile/account/models/user-stats.model'
import { reatomComponent } from '@reatom/npm-react'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = reatomComponent(({ ctx }) => {
  const profileStats = ctx.spy(userProfileStatsResource.dataAtom)

  const details = profileStats?.details
  const meta = profileStats?.meta
  const charts = profileStats?.charts

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col md:flex-row 
        items-center justify-end gap-4 w-full md:h-36 *:w-full *:lg:w-1/3 *:p-4 *:border-2 *:rounded-lg"
      >
        <div
          className="flex cursor-pointer border-green-600 h-full bg-green-800/60 items-end justify-end"
        >
          <Typography className="text-xl font-semibold">
            Просмотры профиля
          </Typography>
        </div>
        <div className="flex cursor-not-allowed border-shark-600 h-full bg-shark-800/60 items-end justify-end">
          <Typography className="text-xl font-semibold">
            Рейтинг
          </Typography>
        </div>
        <div className="flex cursor-not-allowed border-shark-600 h-full bg-shark-800/60 items-end justify-end">
          <Typography className="text-xl font-semibold">
            Лайки
          </Typography>
        </div>
      </div>
      <div className="flex flex-col items-center bg-primary-color p-4 gap-4 rounded-lg w-full h-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Typography textColor="shark_white" className="text-[18px] font-semibold">
              Общая информация
            </Typography>
            {meta && <ProfileAccountStatsMeta meta={meta} />}
          </div>
        </div>
        <div className="flex flex-col w-full">
          {charts && <ProfileAccountStatsCharts charts={charts} />}
        </div>
        {details && <ProfileAccountStatsPlayers details={details} />}
      </div>
    </div>
  )
}, "RouteComponent")

export const Route = createFileRoute('/_protected/dashboard/_dashboard/profile')({
  component: RouteComponent
})