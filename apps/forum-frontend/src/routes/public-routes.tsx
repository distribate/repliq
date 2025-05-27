import { MainPageSkeleton } from '#components/templates/components/main-page-skeleton';
import { NotFound } from '#components/templates/components/not-found';
import { requestedUserParamAtom } from '#components/profile/requested-user.model';
import { IndexRouteComponent } from '#components/shared';
import { UserRouteComponent } from '#components/shared/$nickname';
import { PublicRouteComponent } from '#components/shared/_public';
import { ThreadRouteComponent } from '#components/shared/thread/$id';
import { threadAtom, threadParamAtom } from '#components/thread/thread-main/models/thread.model';
import { take } from '@reatom/framework';
import { reatomLoader } from "@repo/lib/utils/reatom-loader"
import { validatePage } from '@repo/lib/utils/validate-page';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-routes';
import { getUserInformation } from '@repo/lib/helpers/get-user';
import { redirect } from '@tanstack/react-router';
import { NotExistRouteComponent } from '../components/shared/_public/not-exist.lazy';
import { NotOnlineRouteComponent } from '../components/shared/_public/not-online.lazy';
import { BannedRouteComponent } from '../components/shared/_public/banned.lazy';

function generateThreadMetadata(data: { title: string | undefined }) {
  return {
    title: data?.title ?? "Загрузка..."
  }
}

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: PublicRouteComponent,
  id: '_public',
})

const threadRoute = createRoute({
  getParentRoute: () => publicRoute,
  component: ThreadRouteComponent,
  loader: reatomLoader(async (ctx, { params }) => {
    threadParamAtom(ctx, params.id as string)

    let data = ctx.get(threadAtom)

    if (!data) {
      data = await take(ctx, threadAtom)
    }

    return {
      title: data?.title ?? "Не найдено..."
    }
  }),
  head: ({ loaderData }) => ({
    meta: [generateThreadMetadata(loaderData as { title: string | undefined })]
  }),
  path: '/thread/$id',
})

function generateUserMetadata(nickname: string) {
  return {
    title: nickname,
    description: `Профиль игрока ${nickname}`,
    keywords: [
      nickname ?? "player", `fasberry profile player`, `${nickname} profile`
    ],
  }
}

const userRoute = createRoute({
  getParentRoute: () => publicRoute,
  component: UserRouteComponent,
  loader: reatomLoader(async (ctx, { params }) => requestedUserParamAtom(ctx, params.nickname as string)),
  head: ({ params: { nickname } }) => ({
    meta: [generateUserMetadata(nickname)],
    links: [{ rel: "canonical", href: `/user/${nickname}` }],
  }),
  path: '/user/$nickname',
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: IndexRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  head: () => ({ meta: [{ title: 'Главная' }] }),
  pendingComponent: () => <MainPageSkeleton />,
  notFoundComponent: () => <NotFound />,
  path: '/',
})

const bannedRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: BannedRouteComponent,
  path: '/banned',
  loaderDeps: ({ search: { reason, time, created_at } }) => ({ reason, time, created_at }),
  // @ts-ignore
  loader: reatomLoader(async (context, routerCtx) => {
    const isCurrent = await getUserInformation()

    if (isCurrent) {
      throw redirect({ to: "/" })
    }

    // @ts-expect-error
    bannedAtom(context, routerCtx.deps)
  }),
  // @ts-ignore
  validateSearch: (search: Record<string, unknown>): Banned => ({
    reason: search.reason as string ?? "нет",
    time: search.time as string ?? "",
    created_at: search.created_at as string ?? ""
  })
})

export const notExistRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: NotExistRouteComponent,
  path: '/not-exist',
  validateSearch: (search) => {
    return {
      redirect_nickname: search.redirect_nickname as string,
      timeout: search.timeout as string,
    }
  },
})

const notOnlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-online',
  component: NotOnlineRouteComponent,
})

export const publicRoutes = publicRoute.addChildren([
  indexRoute,
  userRoute,
  threadRoute,
  bannedRoute,
  notExistRoute,
  notOnlineRoute
])