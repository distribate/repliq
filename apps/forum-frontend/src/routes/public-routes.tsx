import { MainPageSkeleton } from '#components/templates/components/main-page-skeleton';
import { NotFound } from '#components/templates/components/not-found';
import { requestedUserParamAtom } from '#components/profile/main/models/requested-user.model';
import { threadParamAtom } from '#components/thread/thread-main/models/thread.model';
import { reatomLoader } from '@repo/lib/utils/reatom/reatom-loader';
import { validatePage } from '@repo/lib/utils/validate-page';
import { createRoute } from '@tanstack/react-router';
import { getUserInformation } from '@repo/lib/helpers/get-user';
import { redirect } from '@tanstack/react-router';
import { rootRoute } from './root';
import { IndexRouteComponent } from '#pages/index.page';
import { PublicRouteComponent } from '#pages/public.layout';
import { BannedRouteComponent } from '#pages/banned.page';
import { NotExistRouteComponent } from '#pages/not-exist.page';
import { NotOnlineRouteComponent } from '#pages/not-online.page';
import { RestrictRouteComponent } from '#pages/restrict.page';
import { DevelopmentRouteComponent } from '#pages/development.page';
import { RouteSkeleton } from '#components/templates/components/route-skeleton';
import { lazy, Suspense } from 'react';

const ThreadRouteComponent = lazy(() => import("#pages/thread.page").then(m => ({ default: m.ThreadRouteComponent })))
const UserRouteComponent = lazy(() => import("#pages/user.page").then(m => ({ default: m.UserRouteComponent })))

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: PublicRouteComponent,
  pendingComponent: () => <RouteSkeleton />,
  id: '_public',
});

export const threadRoute = createRoute({
  getParentRoute: () => publicRoute,
  component: () => <Suspense><ThreadRouteComponent/></Suspense>,
  loader: reatomLoader(async (ctx, { params }) => threadParamAtom(ctx, params.id as string)),
  path: '/thread/$id',
});

const userRoute = createRoute({
  getParentRoute: () => publicRoute,
  component: () => <Suspense><UserRouteComponent/></Suspense>,
  loader: reatomLoader(async (ctx, { params }) => requestedUserParamAtom(ctx, params.nickname as string)),
  path: '/user/$nickname',
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: IndexRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  pendingComponent: () => <MainPageSkeleton />,
  notFoundComponent: () => <NotFound />,
  path: '/',
});

const developmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: DevelopmentRouteComponent,
  path: '/development',
});

const restrictRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: RestrictRouteComponent,
  path: '/restrict',
});

const bannedRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: BannedRouteComponent,
  path: '/banned',
  loaderDeps: ({ search: { reason, time, created_at } }) => ({ reason, time, created_at }),
  loader: reatomLoader(async (context, routerCtx) => {
    const isCurrent = await getUserInformation();

    if (isCurrent) {
      throw redirect({ to: '/' });
    }

    // @ts-expect-error
    bannedAtom(context, routerCtx.deps);
  }),
  validateSearch: (search: Record<string, unknown>): { reason: string, time: string, created_at: string } => ({
    reason: search.reason as string ?? 'нет',
    time: search.time as string ?? '',
    created_at: search.created_at as string ?? '',
  }),
});

export const notExistRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: NotExistRouteComponent,
  path: '/not-exist',
  validateSearch: (search: Record<string, unknown>): { redirect_nickname: string, timeout: string } => ({
    redirect_nickname: search.redirect_nickname as string,
    timeout: search.timeout as string,
  })
});

const notOnlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-online',
  component: NotOnlineRouteComponent,
});

export const publicRoutes = publicRoute.addChildren([
  indexRoute,
  userRoute,
  threadRoute,
  bannedRoute,
  notExistRoute,
  notOnlineRoute,
  developmentRoute,
  restrictRoute
]);