import LandingBg from "@repo/assets/images/background.webp"
import LogotypeImage from "@repo/assets/images/logotype.png";
import GhZwggQbMAA from '@repo/assets/images/GhZwggQbMAA-cun.webp'
import GhWLYezW0AA6co3 from '@repo/assets/images/GhWLYezW0AA6co3.webp'
import statue from '@repo/assets/images/8332de192322939.webp'
import { createFileRoute } from '@tanstack/react-router'
import { LatestNews } from '#components/layout/components/stats/latest-news'
import { MainCategories } from '#components/categories/components/categories-list/components/main-categories-list'
import { lazy, Suspense } from 'react'
import { NotFound } from '#components/templates/components/not-found'
import { Footer } from '#components/layout/components/default/footer'
import { SearchWidget } from '#components/layout/components/widgets/search-widget'
import { globalPreferencesAtom } from '@repo/lib/queries/global-preferences-query'
import { LatestRegUsers as RegUsers } from '#components/layout/components/stats/latest-reg-users'
import { isAuthenticatedAtom } from '@repo/lib/queries/global-option-query'
import { MainLayout } from '#components/layout/components/default/layout'
import { validatePage } from '@repo/lib/utils/validate-page'
import { StatusWidget } from '#components/layout/components/widgets/status-widget'
import { Skeleton } from '@repo/ui/src/components/skeleton'
import { reatomComponent } from '@reatom/npm-react'
import { reatomLoader } from "@repo/lib/utils/reatom-loader"
import { LatestCommentsSkeleton, MainPageSkeleton, OnlineUsersSkeleton } from '#components/templates/components/main-page-skeleton'
import { Typography } from '@repo/ui/src/components/typography'
import { Button } from '@repo/ui/src/components/button'
import { AuthorizationButton } from '#components/layout/components/default/navbar'

const AlertWidget = lazy(() => import('#components/layout/components/widgets/alert-widget').then((m) => ({ default: m.AlertWidget })))
const AuthTemplate = lazy(() => import('#components/templates/components/auth-template').then((m) => ({ default: m.AuthTemplate })))
const Comments = lazy(() => import('#components/layout/components/stats/latest-comments').then((m) => ({ default: m.LatestComments })))
const OnlineUsers = lazy(() => import('#components/layout/components/stats/online-users').then((m) => ({ default: m.OnlineUsers })))

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  head: () => ({ meta: [{ title: 'Главная' }] }),
  pendingComponent: () => <MainPageSkeleton />,
  notFoundComponent: () => <NotFound />,
})

const LatestComments = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <Suspense fallback={<LatestCommentsSkeleton />}>
      <Comments />
    </Suspense>
  )
}, "LatestComments")

const LatestRegUsers = reatomComponent(({ ctx }) => {
  return (
    <div className="relative w-full min-h-[140px] rounded-lg overflow-hidden">
      <div className="absolute w-full h-full">
        <RegUsers />
      </div>
      {!ctx.spy(isAuthenticatedAtom) && (
        <Suspense>
          <AuthTemplate />
        </Suspense>
      )}
    </div>
  )
}, "LastRegUsers")

const LandingIntro = reatomComponent(({ ctx }) => {
  if (ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <div className="flex items-center justify-center h-[46vh] relative overflow-hidden w-full">
      <img src={LandingBg} className="absolute inset-0 w-full rounded-xl object-cover h-full" />
      <div className="flex flex-col items-center gap-6 z-[4] justify-center w-full h-full">
        <img src={LogotypeImage} width={168} height={168} alt="" draggable={false} />
        <div className="flex flex-col gap-2 px-2 w-full lg:w-2/3 justify-center items-center text-center">
          <Typography className="text-xl md:text-3xl lg:text-4xl font-bold">
            Создавай <span className="font-[Minecraft]">&nbsp;•&nbsp;</span>Играй<span className="font-[Minecraft]">&nbsp;•&nbsp;</span>Общайся
          </Typography>
          <Typography className="text-lg  md:text-xl font-semibold text-shark-300">
            Обсуждай любимое, делись идеями, находи своих.
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <a href="https://fasberry.su" rel="noreferrer" target="_blank">
            <Button className="flex items-center rounded-lg border-2 border-shark-50 h-10 px-6">
              <Typography textSize="large" className="text-shark-50 font-semibold">
                О проекте
              </Typography>
            </Button>
          </a>
          <AuthorizationButton />
        </div>
      </div>
    </div>
  )
}, "LandingIntro")

const Online = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <Suspense fallback={<OnlineUsersSkeleton />}>
      <OnlineUsers />
    </Suspense>
  )
}, "Online")

const Alerts = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    ctx.spy(globalPreferencesAtom).alerts === 'show' && (
      <Suspense fallback={<Skeleton className="w-full h-28" />}>
        <div className="flex flex-col gap-2 w-full">
          <AlertWidget />
        </div>
      </Suspense>
    )
  )
}, "Alerts")

const MainNavigation = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
      <SearchWidget title="Найти игрока" imageSrc={statue} link="/search?type=users" />
      <SearchWidget title="Найти тред" imageSrc={GhZwggQbMAA} link="/search?type=threads" />
      <SearchWidget title="Найти территорию" imageSrc={GhWLYezW0AA6co3} link="/lands" />
    </div>
  )
}, "MainNavigation")

function RouteComponent() {
  return (
    <MainLayout>
      <main className="flex flex-col w-full gap-2 h-full">
        <LandingIntro />
        <Alerts />
        <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
          <div className="flex flex-col w-full xl:w-3/4 gap-2 h-full">
            <StatusWidget />
            <MainNavigation />
            <MainCategories />
            <Footer />
          </div>
          <div className="flex flex-col gap-2 w-full xl:w-1/4 h-full">
            <LatestComments />
            <LatestNews />
            <LatestRegUsers />
            <Online />
          </div>
        </div>
      </main>
    </MainLayout>
  )
}