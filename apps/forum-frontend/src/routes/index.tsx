import { createFileRoute } from '@tanstack/react-router'
import { LatestNews } from '#components/layout/components/stats/latest-news'
import { OnlineUsers } from '#components/layout/components/stats/online-users'
import { LatestComments } from '#components/layout/components/stats/latest-comments'
import { MainCategoriesList } from '#components/categories/components/categories-list/components/main-categories-list'
import { lazy } from 'react'
import { NotFound } from '#components/templates/components/not-found'
import { Footer } from '#components/layout/components/default/footer'
import { SearchWidget } from '#components/layout/components/widgets/search-widget'
import { globalPreferencesQuery } from '@repo/lib/queries/global-preferences-query'
import { LastRegUsers } from '#components/layout/components/stats/last-reg-users'
import GhZwggQbMAA from '@repo/assets/images/GhZwggQbMAA-cun.webp'
import GhWLYezW0AA6co3 from '@repo/assets/images/GhWLYezW0AA6co3.webp'
import statue from '@repo/assets/images/8332de192322939.webp'
import { globalOptionQuery } from '@repo/lib/queries/global-option-query'
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query'
import { getUserInformation } from '@repo/lib/queries/get-user-information'
import { MainLayout } from '#components/layout/components/default/layout'
import { validatePage } from '@repo/lib/utils/validate-page'
import { StatusWidget } from '#components/layout/components/widgets/status-widget'
import { Typography } from '@repo/ui/src/components/typography'
import { Skeleton } from '@repo/ui/src/components/skeleton'

const AlertWidget = lazy(() =>
  import('#components/layout/components/widgets/alert-widget').then((m) => ({ default: m.AlertWidget })),
)

export const Route = createFileRoute('/')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Главная' }],
  }),
  loader: async ({ context: ctx }) => {
    const isValid = await validatePage(ctx.queryClient)

    if (isValid) {
      await ctx.queryClient.ensureQueryData({
        queryKey: CURRENT_USER_QUERY_KEY, queryFn: getUserInformation,
      })
    }
  },
  pendingComponent: () => (
    <div className="flex w-full relative min-h-screen items-center justify-center p-2 overflow-hidden">
      <div className="flex flex-col gap-4 w-full lg:w-[84%] h-full items-center justify-start">
        <Skeleton className="w-full h-[90px]" />
        <div id="main" className="flex gap-y-4 w-full h-full min-h-screen main-section">
          <div className="flex min-h-dvh w-full items-center justify-center">
            <div className="flex items-start justify-center h-full w-full gap-2">
              <div className="flex flex-col 2xl:w-3/4 h-full gap-2">
                <Skeleton className="w-full max-h-[400px] h-[340px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
                  <Skeleton className="w-full h-full" />
                  <Skeleton className="w-full h-full" />
                  <Skeleton className="w-full h-full" />
                </div>
                <Skeleton className="w-full h-[300px]" />
                <Skeleton className="w-full h-[230px]" />
              </div>
              <div className='flex flex-col h-full 2xl:w-1/4 gap-2'>
                <Skeleton className="w-full h-full " />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  notFoundComponent: () => <NotFound />,
})

const AuthTemplate = () => {
  return (
    <div className="flex flex-col bg-white/10 backdrop-blur-sm items-center gap-4 justify-center absolute z-[2] w-full h-full">
      <Typography className="text-[18px] font-bold text-center">
        Авторизуйтесь и станьте частью сообщества Fasberry!
      </Typography>
    </div>
  )
}

function RouteComponent() {
  const { alerts: alertsShowing } = globalPreferencesQuery().data
  const { isAuthenticated } = globalOptionQuery().data

  return (
    <MainLayout>
      <main className="flex flex-col w-full gap-2 h-full">
        {alertsShowing === 'show' && <AlertWidget />}
        <div className="flex 2xl:flex-row gap-2 flex-col w-full h-full">
          <div className="flex flex-col w-full 2xl:w-3/4 gap-2 h-full">
            <StatusWidget />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
              <SearchWidget title="Найти игрока" imageSrc={statue} link="/search?type=users" />
              <SearchWidget title="Найти тред" imageSrc={GhZwggQbMAA} link="/search?type=threads" />
              <SearchWidget title="Найти территорию" imageSrc={GhWLYezW0AA6co3} link="/lands" />
            </div>
            {isAuthenticated ? <MainCategoriesList /> : (
              <div className="relative w-full min-h-[300px] h-fit rounded-lg overflow-hidden">
                <div className="flex flex-col gap-2 absolute w-full p-4 h-full">
                  <div className="bg-shark-950 w-full rounded-lg h-20" />
                  <div className="bg-shark-950 w-full rounded-lg h-20" />
                  <div className="bg-shark-950 w-full rounded-lg h-20" />
                </div>
                <AuthTemplate />
              </div>
            )}
            <Footer />
          </div>
          <div className="flex flex-col order-last gap-2 w-full 2xl:w-1/4 h-full">
            {isAuthenticated && <LatestComments />}
            <LatestNews />
            <div className="relative w-full min-h-[140px] rounded-lg overflow-hidden">
              <div className="absolute w-full h-full">
                <LastRegUsers />
              </div>
              {!isAuthenticated && <AuthTemplate />}
            </div>
            {isAuthenticated && <OnlineUsers />}
          </div>
        </div>
      </main>
    </MainLayout>
  )
}