import { userProfileStatsQuery } from '#components/profile/account/queries/user-profile-stats-query'
import { Avatar } from '#components/user/avatar/components/avatar'
import { UserNickname } from '#components/user/name/nickname'
import { currentUserQuery } from '@repo/lib/queries/current-user-query'
import { USER_URL } from '@repo/shared/constants/routes'
import { Skeleton } from '@repo/ui/src/components/skeleton'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_protected/dashboard/_dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const nickname = currentUserQuery().data.nickname
  const { data: profileStats } = userProfileStatsQuery()

  const meta = profileStats?.meta

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full h-36 bg-primary-color p-4 rounded-lg">
        <Suspense fallback={<Skeleton className="w-[96px] h-[96px]" />}>
          <Avatar nickname={nickname} propWidth={96} propHeight={96} />
        </Suspense>
        <div className="flex flex-col">
          <UserNickname nickname={nickname} className="text-2xl" />
          <Link to={USER_URL + nickname}>
            <Typography className="font-semibold text-base text-shark-300">
              к профилю {`>`}
            </Typography>
          </Link>
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
}