import { Typography } from "@repo/ui/src/components/typography.tsx";
import { userProfileStatsAction } from "../models/user-stats.model";
import { BuyDonateModal } from "#components/modals/custom/buy-donate-modal";
import { HTMLAttributes } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";
import { getUser } from "#components/user/models/current-user.model";
import { navigate } from "vike/client/router";
import { prefetch } from 'vike/client/router'

type AccountStatSectionProps = {
  title: string,
} & HTMLAttributes<HTMLDivElement>

const AccountStatSection = ({
  title, children, ...props
}: AccountStatSectionProps) => {
  return (
    <div className="flex flex-col gap-2 items-start p-4 w-full bg-shark-950 rounded-lg" {...props}>
      <Typography className="text-[18px] font-medium">
        {title}
      </Typography>
      {children}
    </div>
  )
}

const ProfileAccountStatsDetails = reatomComponent(({ ctx }) => {
  const profileStats = ctx.spy(userProfileStatsAction.dataAtom)

  const handleRedirect = async () => {
    if (!profileStats?.details) {
      return;
    }

    const link = "/dashboard/profile"

    prefetch(link)
    await navigate(link)
  }

  return (
    <AccountStatSection title="Детали">
      <Typography textColor="gray" textSize="big" onClick={handleRedirect} className="cursor-pointer">
        детальная информация о профиле
      </Typography>
    </AccountStatSection>
  )
}, "ProfileAccountStatsDetails")

onConnect(userProfileStatsAction.dataAtom, userProfileStatsAction)

export const ProfileAccountStats = reatomComponent(({ ctx }) => {
  const profileStats = ctx.spy(userProfileStatsAction.dataAtom)
  const isDonate = getUser(ctx).is_donate

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" textSize="big" className="font-semibold">
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
            {!isDonate && (
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
        {isDonate && <ProfileAccountStatsDetails />}
      </div>
    </div>
  );
}, "ProfileAccountStats")