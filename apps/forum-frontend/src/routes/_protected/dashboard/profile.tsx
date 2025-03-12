import { BuyDonateModal } from '#components/modals/custom/buy-donate-modal'
import { ProfileAccountStatsCharts } from '#components/profile/account/components/stats/profile-account-stats-charts'
import { ProfileAccountStatsMeta, ProfileAccountStatsPlayers } from '#components/profile/account/components/stats/profile-account-stats-list'
import { userProfileStatsQuery } from '#components/profile/account/queries/user-profile-stats-query'
import { currentUserQuery } from '@repo/lib/queries/current-user-query'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/profile')({
  component: RouteComponent
})

function RouteComponent() {
  const { donate } = currentUserQuery().data
  const isValid = donate !== 'default'

  const { data: profileStats } = userProfileStatsQuery(isValid)

  if (!isValid) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <Typography className="text-[18px] font-medium">
          Приобретите любую привилегию на сервере, чтобы открыть доступ к статистике своего профиля
        </Typography>
        <BuyDonateModal
          trigger={
            <div
              className="cursor-pointer inline-flex w-fit items-center
             bg-shark-700 rounded-lg justify-center px-1 py-[0.5px]"
            >
              <span className="ml-[2px] text-[14px] self-end">
                что это?
              </span>
            </div>
          }
        />
      </div>
    )
  }

  const details = profileStats?.details
  const meta = profileStats?.meta
  const charts = profileStats?.charts

  if (!isValid) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <Typography className="text-[18px] font-medium">
          Информация о профиле недоступна
        </Typography>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-primary-color rounded-lg p-2 lg:p-4 gap-4 w-full h-full">
      <div className="flex flex-col md:flex-row items-center justify-end gap-4 w-full h-36 *:w-full *:lg:w-1/3 *:p-4 *:border-2 *:rounded-lg">
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
      </div>
      <div className="flex flex-col items-center gap-y-4 w-full h-full">
        <div className="flex flex-row items-start p-4 w-full gap-4 h-fit">
          <div className="flex flex-col gap-y-4 w-2/4 h-full">
            <div className="flex flex-col gap-y-2 w-full h-full">
              <Typography textColor="shark_white" className="text-[18px] font-semibold">
                Общая информация
              </Typography>
              {meta && <ProfileAccountStatsMeta meta={meta} />}
            </div>
            {details && <ProfileAccountStatsPlayers details={details} />}
          </div>
          <div className="flex flex-col w-2/4 h-full">
            {charts && <ProfileAccountStatsCharts charts={charts} />}
          </div>
        </div>
      </div>
    </div>
  )
}
