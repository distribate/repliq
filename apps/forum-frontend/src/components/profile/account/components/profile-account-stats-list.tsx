import { Typography } from "@repo/ui/src/components/typography.tsx";
import { userProfileStatsResource } from "../models/user-stats.model";
import { getUser } from "@repo/lib/helpers/get-user";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Button } from "@repo/ui/src/components/button";
import { ProfileStatsMeta, ProfileViewsDetails } from "@repo/types/routes-types/get-user-profile-stats-types";
import { BuyDonateModal } from "#components/modals/custom/components/buy-donate-modal";
import { Avatar } from "#components/user/avatar/components/avatar";
import { useNavigate } from "@tanstack/react-router";
import { HTMLAttributes } from "react";
import dayjs from "@repo/lib/constants/dayjs-instance"
import { Separator } from "@repo/ui/src/components/separator";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";

type AccountStatSectionProps = {
  title: string,
} & HTMLAttributes<HTMLDivElement>

type ProfileAccountStatsMetaProps = {
  meta: ProfileStatsMeta
}

type ProfileAccountStatsPlayersProps = {
  details: ProfileViewsDetails[]
}

export const AccountStatSection = ({
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

export const ProfileAccountStatsMeta = ({
  meta
}: ProfileAccountStatsMetaProps) => {
  return (
    <div className="flex items-center gap-2 w-full h-full">
      <div className="flex items-center *:font-semibold *:text-lg">
        <Typography>{meta.views_by_day}/</Typography>
        <Typography>{meta.views_by_month}/</Typography>
        <Typography>{meta.views_all}</Typography>
      </div>
      <Separator orientation="vertical" />
      <Typography>
        [день/месяц/всего]
      </Typography>
    </div>
  )
}

export const ProfileAccountStatsPlayers = ({
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
        <DialogContent className="w-full px-4">
          <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
            <Typography variant="dialogTitle">
              Пользователи, просмотревшие ваш профиль недавно
            </Typography>
            <div className="flex flex-col gap-1 w-full p-2">
              {details.map((item, idx) =>
                <div key={idx} className="flex bg-shark-800 p-2 rounded-lg w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CustomLink to={createIdLink("user", item.initiator)}>
                      <Avatar nickname={item.initiator} propWidth={36} propHeight={36} />
                    </CustomLink>
                    <div className="flex flex-col">
                      <CustomLink to={createIdLink("user", item.initiator)}>
                        <Typography className="text-base text-shark-50">
                          {item.initiator}
                        </Typography>
                      </CustomLink>
                      <Typography className="text-shark-300 text-sm">
                        {dayjs(item.created_at).format("DD MMM YYYY HH:mm")}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const ProfileAccountStatsDetails = reatomComponent(({ ctx }) => {
  const profileStats = ctx.spy(userProfileStatsResource.dataAtom)
  const navigate = useNavigate()

  const handleRedirect = () => {
    if (!profileStats?.details) {
      return;
    }

    navigate({ to: "/dashboard/profile" })
  }

  return (
    <AccountStatSection title="Детали">
      <Typography textColor="gray" textSize="small" onClick={handleRedirect} className="cursor-pointer">
        детальная информация о профиле
      </Typography>
    </AccountStatSection>
  )
}, "ProfileAccountStatsDetails")

onConnect(userProfileStatsResource.dataAtom, userProfileStatsResource)

export const ProfileAccountStats = reatomComponent(({ ctx }) => {
  const profileStats = ctx.spy(userProfileStatsResource.dataAtom)
  const donate = getUser(ctx).donate

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
}, "ProfileAccountStats")