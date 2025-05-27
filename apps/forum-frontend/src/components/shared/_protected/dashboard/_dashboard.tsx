import { Typography } from '@repo/ui/src/components/typography'
import { useLocation } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import FutureChickenMini from "@repo/assets/images/minecraft/future_chicken_mini.png"
import { reatomComponent } from '@reatom/npm-react'
import { getUser } from '@repo/lib/helpers/get-user'
import { CustomLink } from '#components/shared/link'

const Page = reatomComponent(({ ctx }) => {
  const donate = getUser(ctx).donate
  const isValid = donate !== 'default'

  if (!isValid) return <NoAccessDashboard />

  return (
    <div className="flex flex-col md:flex-row items-start w-full gap-6 h-full">
      <DashboardNavigation />
      <div className="flex w-full md:w-3/4 h-full">
        <Outlet />
      </div>
    </div>
  )
}, "RouteComponent")

const NoAccessDashboard = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full md:h-[80vh]">
      <img src={FutureChickenMini} alt="" width={256} height={256} className="h-[128px] w-[128px] md:w-[256px] md:h-[256px]" />
      <Typography className="text-2xl text-center font-semibold w-full lg:w-[60%]">
        Приобретите любую привилегию на сервере, чтобы открыть доступ к статистике своего профиля!
      </Typography>
      <a
        href="https://fasberry.su/shop"
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
  const pathname = useLocation({ select: s => s.pathname })

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
          className="flex cursor-pointer items-center gap-2 group w-full 
              [&.active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Профиль
          </Typography>
        </CustomLink>
        <CustomLink
          to="/dashboard/threads"
          className="flex cursor-pointer items-center gap-2 group w-full 
            [&.active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Треды
          </Typography>
        </CustomLink>
      </div>
    </div>
  )
}

export function DashboardRouteComponent() {
  return <Page/>
}