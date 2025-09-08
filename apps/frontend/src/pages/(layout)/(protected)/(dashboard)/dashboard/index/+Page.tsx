import { userProfileStatsAction } from '#components/profile/account/models/user-stats.model'
import { CustomLink } from '#shared/components/link'
import { Avatar } from '#components/user/components/avatar/components/avatar'
import { UserNickname } from '#components/user/components/name/nickname'
import { reatomComponent } from '@reatom/npm-react'
import { createIdLink } from '#lib/create-link'
import { Typography } from '@repo/ui/src/components/typography'
import { getUser } from "#components/user/models/current-user.model";

const DashboardIndex = reatomComponent(({ ctx }) => {
  const { avatar, nickname } = getUser(ctx)
  const profileStats = ctx.spy(userProfileStatsAction.dataAtom)

  const meta = profileStats?.meta

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:h-36 bg-primary-color p-4 rounded-lg">
        <Avatar url={avatar} nickname={nickname} propWidth={96} propHeight={96} />
        <div className="flex flex-col">
          <UserNickname nickname={nickname} className="text-2xl" />
          <CustomLink to={createIdLink("user", nickname)}>
            <Typography className="font-semibold text-base text-shark-300">
              к профилю {`>`}
            </Typography>
          </CustomLink>
        </div>
      </div>
      <div className="flex flex-col bg-primary-color p-4 gap-4 rounded-lg w-full h-full">
        <Typography textSize="big" className="font-semibold">
          Аналитика
        </Typography>
        <div className="flex bg-shark-900 p-2 rounded-lg items-end gap-2 w-full">
          <Typography className="text-5xl text-shark-50 font-bold">
            {meta?.views_all}
          </Typography>
          <Typography className="text-shark-300 text-base">
            просмотров профиля
          </Typography>
        </div>
        <div className="flex bg-shark-900 p-2 rounded-lg items-end gap-2 w-full">
          <Typography className="text-5xl text-shark-50 font-bold">
            0
          </Typography>
          <Typography className="text-shark-300 text-base">
            лайков профиля
          </Typography>
        </div>
      </div>
    </div>
  )
}, "RouteComponent")

export default function Page() {
  return <DashboardIndex />
}