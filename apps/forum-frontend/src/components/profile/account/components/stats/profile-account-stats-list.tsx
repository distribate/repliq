import { Typography } from "@repo/ui/src/components/typography.tsx";
import { USER_PROFILE_STATS_QUERY_KEY, userProfileStatsQuery } from "../../queries/user-profile-stats-query";
import { getUser } from "@repo/lib/helpers/get-user";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Button } from "@repo/ui/src/components/button";
import { ProfileAccountStatsCharts } from "./profile-account-stats-charts";
import { ProfileStatsDetailed, ProfileStatsMeta, ProfileViewsDetails } from "@repo/types/routes-types/get-user-profile-stats-types";
import { useQueryClient } from "@tanstack/react-query";
import { BuyDonateModal } from "#components/modals/custom/buy-donate-modal";
import { Avatar } from "#components/user/avatar/components/avatar";

type AccountStatSectionProps = {
  title: string,
  children?: React.ReactNode
}

type ProfileAccountStatsMetaProps = {
  meta: ProfileStatsMeta
}

type ProfileAccountStatsPlayersProps = {
  details: ProfileViewsDetails[]
}

const AccountStatSection = ({
  title, children
}: AccountStatSectionProps) => {
  return (
    <div className="flex flex-col gap-2 items-start p-4 w-full bg-shark-950 rounded-lg">
      <Typography className="text-[18px] font-medium">
        {title}
      </Typography>
      {children}
    </div>
  )
}

const ProfileAccountStatsMeta = ({
  meta
}: ProfileAccountStatsMetaProps) => {
  return (
    <div className="flex flex-col gap-y-1 w-full h-full">
      <Typography>
        Просмотров за день: {meta.views_by_day}
      </Typography>
      <Typography>
        Просмотров за месяц: {meta.views_by_month}
      </Typography>
      <Typography>
        Просмотров за все время: {meta.views_all}
      </Typography>
    </div>
  )
}

const ProfileAccountStatsPlayers = ({
  details
}: ProfileAccountStatsPlayersProps) => {
  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      <Typography textColor="shark_white" className="text-[18px] font-semibold">
        Игроки
      </Typography>
      <Dialog>
        <DialogTrigger asChild className="w-fit">
          <Button state="default">
            <Typography>
              Просмотреть список
            </Typography>
          </Button>
        </DialogTrigger>
        <DialogContent>
          {details.map(({ created_at, initiator, recipient }) =>
            <div className="flex items-center gap-2 w-fit">
              <Avatar nickname={initiator} propWidth={20} propHeight={20} />
              <Typography>
                {initiator}
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const ProfileAccountStatsDetails = () => {
  const qc = useQueryClient()
  const profileStats = qc.getQueryData<ProfileStatsDetailed>(USER_PROFILE_STATS_QUERY_KEY)

  const details = profileStats?.details
  const meta = profileStats?.meta
  const charts = profileStats?.charts

  return (
    <Dialog>
      <DialogTrigger>
        <AccountStatSection title="Детали">
          <Typography textColor="gray" className="text-[18px] font-medium">
            детальная информация о профиле
          </Typography>
        </AccountStatSection>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        {!details && (
          <div className="flex items-center justify-center w-full h-full p-4">
            <Typography className="text-[18px] font-medium">
              Информация о профиле недоступна
            </Typography>
          </div>
        )}
        {details && (
          <div className="flex flex-col items-center gap-y-4 w-full h-full">
            <Typography variant="dialogTitle">
              Статистика профиля
            </Typography>
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
        )}
      </DialogContent>
    </Dialog>
  )
}

export const ProfileAccountStats = () => {
  const { data: profileStats, isError, failureReason } = userProfileStatsQuery()
  const { donate } = getUser()

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography
            textColor="shark_white"
            textSize="big"
            className="font-semibold"
          >
            Статистика аккаунта
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-auto gap-4 w-full h-full">
        <AccountStatSection title="Просмотры профиля">
          <div className="flex items-center gap-2 w-fit">
            <Typography textColor="gray" className="text-[18px] font-medium">
              {profileStats?.meta.views_all}&nbsp;
              <span className="ml-[2px] text-[14px] self-end">
                +{profileStats?.meta.views_by_day} за сегодня
              </span>
            </Typography>
            {donate === 'default' && (
              <BuyDonateModal
                trigger={
                  <div
                    title="Кто?"
                    className="cursor-pointer inline-flex w-fit items-center
                     bg-shark-700 rounded-lg justify-center px-1 py-[0.5px]"
                  >
                    <span className="ml-[2px] text-[14px] self-end">
                      кто?
                    </span>
                  </div>
                }
              />
            )}
          </div>
        </AccountStatSection>
        <AccountStatSection title="Рейтинг популярности">
          <Typography textColor="gray" className="text-[18px] font-medium">
            {profileStats?.meta.rank} место
          </Typography>
        </AccountStatSection>
        {donate !== 'default' && <ProfileAccountStatsDetails />}
      </div>
    </div>
  );
};
