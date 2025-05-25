import { createFileRoute } from '@tanstack/react-router'
import { LatestNews } from '#components/layout/components/stats/latest-news'
import { MainCategories } from '#components/categories/components/categories-list/components/main-categories-list'
import { lazy, Suspense } from 'react'
import { NotFound } from '#components/templates/components/not-found'
import { Footer } from '#components/layout/components/default/footer'
import { SearchWidget } from '#components/layout/components/widgets/search-widget'
import { globalPreferencesAtom } from '@repo/lib/queries/global-preferences-query'
import { LastRegUsers } from '#components/layout/components/stats/last-reg-users'
import GhZwggQbMAA from '@repo/assets/images/GhZwggQbMAA-cun.webp'
import GhWLYezW0AA6co3 from '@repo/assets/images/GhWLYezW0AA6co3.webp'
import statue from '@repo/assets/images/8332de192322939.webp'
import { globalOptionsAtom } from '@repo/lib/queries/global-option-query'
import { MainLayout } from '#components/layout/components/default/layout'
import { validatePage } from '@repo/lib/utils/validate-page'
import { StatusWidget } from '#components/layout/components/widgets/status-widget'
import { Skeleton } from '@repo/ui/src/components/skeleton'
import { reatomComponent } from '@reatom/npm-react'
import { reatomLoader } from "@repo/lib/utils/reatom-loader"
import { currentUserResource } from '@repo/lib/helpers/get-user'
import { MainPageSkeleton } from '#components/templates/components/main-page-skeleton'

const AlertWidget = lazy(() => import('#components/layout/components/widgets/alert-widget').then((m) => ({ default: m.AlertWidget })))
const AuthTemplate = lazy(() => import('#components/templates/components/auth-template').then((m) => ({ default: m.AuthTemplate })))
const LatestComments = lazy(() => import('#components/layout/components/stats/latest-comments').then((m) => ({ default: m.LatestComments })))
const OnlineUsers = lazy(() => import('#components/layout/components/stats/online-users').then((m) => ({ default: m.OnlineUsers })))

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: reatomLoader(async (context) => {
    const isValid = await validatePage(context)

    if (isValid) await currentUserResource(context)
  }),
  head: () => ({ meta: [{ title: 'Главная' }] }),
  pendingComponent: () => <MainPageSkeleton />,
  notFoundComponent: () => <NotFound />,
})

const Comments = reatomComponent(({ ctx }) => {
  return (
    ctx.spy(globalOptionsAtom).isAuthenticated && (
      <Suspense>
        <LatestComments />
      </Suspense>
    )
  )
}, "Comments")

const LastReg = reatomComponent(({ ctx }) => {
  return (
    <div className="relative w-full min-h-[140px] rounded-lg overflow-hidden">
      <div className="absolute w-full h-full">
        <LastRegUsers />
      </div>
      {!ctx.spy(globalOptionsAtom).isAuthenticated && (
        <Suspense>
          <AuthTemplate />
        </Suspense>
      )}
    </div>
  )
}, "LastReg")

const Online = reatomComponent(({ ctx }) => {
  return (
    ctx.spy(globalOptionsAtom).isAuthenticated && (
      <Suspense>
        <OnlineUsers />
      </Suspense>
    )
  )
}, "Online")

const Alerts = reatomComponent(({ ctx }) => {
  return (
    ctx.spy(globalPreferencesAtom).alerts === 'show' && (
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <div className="flex flex-col gap-2 w-full">
          <AlertWidget />
        </div>
      </Suspense>
    )
  )
}, "Alerts")

const MainNavigation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
      <SearchWidget title="Найти игрока" imageSrc={statue} link="/search?type=users" />
      <SearchWidget title="Найти тред" imageSrc={GhZwggQbMAA} link="/search?type=threads" />
      <SearchWidget title="Найти территорию" imageSrc={GhWLYezW0AA6co3} link="/lands" />
    </div>
  )
}

function RouteComponent() {
  return (
    <MainLayout>
      <main className="flex flex-col w-full gap-2 h-full">
        <Alerts />
        <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
          <div className="flex flex-col w-full xl:w-3/4 gap-2 h-full">
            <StatusWidget />
            <MainNavigation />
            <MainCategories />
            <Footer />
          </div>
          <div className="flex flex-col gap-2 w-full xl:w-1/4 h-full">
            <Comments />
            <LatestNews />
            <LastReg />
            <Online />
          </div>
        </div>
      </main>
    </MainLayout>
  )
}