import { Typography } from '@repo/ui/src/components/typography'
import { reatomComponent } from '@reatom/npm-react'
import { CustomLink } from '#components/shared/link'
import { MINECRAFT_SITE_DOMAIN } from '@repo/shared/constants/origin-list'
import { IconSparkles } from '@tabler/icons-react'
import { getUser } from '#components/user/models/current-user.model'
import { PropsWithChildren, Suspense } from 'react'
import { usePageContext } from 'vike-react/usePageContext'

const Page = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  const is_donate = getUser(ctx).is_donate
  const isValid = is_donate === true

  if (!isValid) return <NoAccessDashboard />

  return (
    <div className="flex flex-col md:flex-row items-start w-full gap-6 h-full">
      <DashboardNavigation />
      <div className="flex w-full md:w-3/4 h-full">
        {children}
      </div>
    </div>
  )
}, "RouteComponent")

const NoAccessDashboard = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full md:h-[80vh]">
      <IconSparkles size={128} className="text-green-500" />
      <Typography className="text-2xl text-center font-semibold w-full lg:w-[60%]">
        Приобретите любую привилегию на сервере, чтобы открыть доступ к статистике своего профиля!
      </Typography>
      <a
        href={`${MINECRAFT_SITE_DOMAIN}/shop`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-fit py-2 bg-green-600 px-6 rounded-lg"
      >
        <Typography className="text-xl font-semibold">
          Приобрести
        </Typography>
      </a>
    </div>
  )
}

const DashboardNavigation = () => {
  const pathname = usePageContext().urlPathname

  return (
    <div className="flex flex-col gap-4 bg-primary-color rounded-lg p-4 w-full md:w-1/4">
      <Typography textSize="very_big" className="font-semibold">
        Дашборд
      </Typography>
      <div className="flex flex-col gap-1 w-full *:duration-150 *:ease-in-out">
        <CustomLink
          to="/dashboard"
          data-state={pathname === "/dashboard" ? "active" : "inactive"}
          className="flex cursor-pointer items-center gap-2 group w-full 
              data-[state=active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Обзор
          </Typography>
        </CustomLink>
        <CustomLink
          to="/dashboard/profile"
          data-state={pathname === "/dashboard/profile" ? "active" : "inactive"}
          className="flex cursor-pointer items-center gap-2 group w-full 
              data-[state=active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Профиль
          </Typography>
        </CustomLink>
        <CustomLink
          to="/dashboard/threads"
          data-state={pathname === "/dashboard/threads" ? "active" : "inactive"}
          className="flex cursor-pointer items-center gap-2 group w-full 
            data-[state=active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Треды
          </Typography>
        </CustomLink>
      </div>
    </div>
  )
}

export default function DashboardRouteComponent({ children }: PropsWithChildren) {
  return (
    <Page >
      {children}
    </Page>
  )
}