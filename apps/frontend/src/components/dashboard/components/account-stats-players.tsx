import { Avatar } from "#components/user/components/avatar/components/avatar"
import { CustomLink } from "#shared/components/link"
import { createIdLink } from "#shared/helpers/create-link"
import { Button } from "@repo/ui/src/components/button"
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import dayjs from "@repo/shared/constants/dayjs-instance"
import { ProfileStatsMeta, ProfileViewsDetails } from "@repo/types/routes-types/get-user-profile-stats-types"
import { Separator } from "@repo/ui/src/components/separator"

type AccountStatsPlayersProps = {
  details: ProfileViewsDetails[]
}

type AccountStatsMetaProps = {
  meta: ProfileStatsMeta
}

export const AccountStatsMeta = ({
  meta
}: AccountStatsMetaProps) => {
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

export const AccountStatsPlayers = ({
  details
}: AccountStatsPlayersProps) => {
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
                      <Avatar url={item.avatar} nickname={item.initiator} propWidth={36} propHeight={36} />
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