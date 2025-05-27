import { ProtectedRouteComponent } from "#components/shared/_protected";
import { RouteSkeleton } from "#components/templates/components/route-skeleton";
import { reatomLoader } from "@repo/lib/utils/reatom-loader";
import { validateAdmin, validatePage } from "@repo/lib/utils/validate-page";
import { createRoute, redirect } from "@tanstack/react-router";
import { AdminRouteComponent } from "../components/shared/_admin.lazy";
import { AdminSections } from "#components/admin/navigation/admin-navigation-badge";
import { AdminConfigRouteComponent } from "../components/shared/_protected/_admin/admin/configs.lazy";
import { AdminIndexRouteComponent } from "../components/shared/_protected/_admin/admin/index.lazy";
import { AdminDashboardRouteComponent } from "../components/shared/_protected/_admin/admin/dashboard.lazy";
import { AdminStatsRouteComponent } from "../components/shared/_protected/_admin/admin/stats.lazy";
import { AdminSupportRouteComponent } from "../components/shared/_protected/_admin/admin/support.lazy";
import { EventsRouteComponent } from "../components/shared/_protected/events.lazy";
import { FriendsRouteComponent } from "../components/shared/_protected/friends.lazy";
import { NotificationsRouteComponent } from "../components/shared/_protected/notifications.lazy";
import { Params, SearchRouteComponent } from "../components/shared/_protected/search";
import { DEFAULT_TYPE_PARAM, searchTypeParamAtom } from "#components/search/models/search-related.model";
import { CollectionRouteComponent } from "../components/shared/_protected/collection";
import { logger } from "@repo/lib/utils/logger";
import { CollectionParams } from "#components/collection/components/navigation/components/collection-navigation";
import { RatingsRouteComponent } from "../components/shared/_protected/ratings/index.lazy";
import { LandsRouteComponent } from "../components/shared/_protected/lands";
import { LandRouteComponent } from "../components/shared/_protected/lands/$id";
import { take } from "@reatom/framework";
import { landAtom, landParamAtom } from "#components/land/models/land.model";
import { DashboardProfileRouteComponent } from "../components/shared/_protected/dashboard/_dashboard/profile";
import { DashboardThreadsRouteComponent } from "../components/shared/_protected/dashboard/_dashboard/threads";
import { DashboardIndexRouteComponent } from "../components/shared/_protected/dashboard/_dashboard/index";
import { CategoryRouteComponent } from "../components/shared/_protected/category/$id";
import { categoryIdAtom } from "#components/categories/components/category-threads/models/category.model";
import { CreateThreadRouteComponent } from "../components/shared/_protected/(actions)/create-thread.lazy";
import { CreateTicketRouteComponent } from "../components/shared/_protected/(actions)/create-ticket.lazy";
import { DashboardRouteComponent } from "#components/shared/_protected/dashboard/_dashboard";
import { rootRoute } from "./__root";

export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ProtectedRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx, "redirect")),
  pendingComponent: () => <RouteSkeleton />,
  id: '_protected',
})

export const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: AdminRouteComponent,
  beforeLoad: async () => {
    const isValid = await validateAdmin()
    if (!isValid) throw redirect({ to: "/" })
  },
  validateSearch: (search: Record<string, unknown>): { section?: AdminSections } => ({
    section: search.section as AdminSections ?? undefined
  }),
  id: "_admin"
})

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  component: AdminIndexRouteComponent,
  path: "/",
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  component: AdminDashboardRouteComponent,
  path: "/dashboard",
})

const adminConfigRoute = createRoute({
  getParentRoute: () => adminRoute,
  component: AdminConfigRouteComponent,
  path: "/configs"
})

const adminStatsRoute = createRoute({
  getParentRoute: () => adminRoute,
  component: AdminStatsRouteComponent,
  path: "/stats"
})

const adminSupportRoute = createRoute({
  getParentRoute: () => adminRoute,
  component: AdminSupportRouteComponent,
  path: "/support"
})

const adminRoutes = adminRoute.addChildren([
  adminIndexRoute,
  adminDashboardRoute,
  adminConfigRoute,
  adminStatsRoute,
  adminSupportRoute
])

function generateEventsMetadata() {
  return { title: 'Ивенты', }
}

const eventsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: EventsRouteComponent,
  path: "/events",
  head: () => ({ meta: [generateEventsMetadata()] }),
})

function generateFriendsMetadata() {
  return { title: 'Друзья' }
}

const friendsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: FriendsRouteComponent,
  path: "/friends",
  head: () => ({ meta: [generateFriendsMetadata()] }),
})

function generateNotificationsMetadata() {
  return { title: 'Уведомления' }
}

const notificationsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: NotificationsRouteComponent,
  path: "/notifications",
  head: () => ({ meta: [generateNotificationsMetadata()] }),
})

function generateSearchMetadata() {
  return { title: 'Поиск' }
}

const searchRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: SearchRouteComponent,
  path: "/search",
  head: () => ({ meta: [generateSearchMetadata()] }),
  loader: reatomLoader(async (context, { location }) => {
    const { type } = location.search as { type: Params["type"] }

    searchTypeParamAtom(context, type)
  }),
  validateSearch: (search: Record<string, unknown>): Params => ({
    type: search.type as Params["type"] ?? DEFAULT_TYPE_PARAM,
    query: search.query as string | undefined ?? undefined
  })
})

function generateCollectionMetadata() {
  return { title: "Коллекции" }
}

const DEFAULT_COLLECTION_TYPE = "purchases"

const collectionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: CollectionRouteComponent,
  path: "/collection",
  head: () => ({ meta: [generateCollectionMetadata()] }),
  loader: reatomLoader(async (_, { params }) => logger.info(params)),
  validateSearch: (search: Record<string, string>): { type: CollectionParams["type"] } => ({
    type: (search.type as CollectionParams["type"]) || DEFAULT_COLLECTION_TYPE
  })
})

function generateRatingsMetadata() {
  return {
    title: 'Рейтинг игроков',
    description: "Игровой рейтинг игроков"
  }
}

const ratingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: RatingsRouteComponent,
  path: "/ratings",
  head: () => ({ meta: [generateRatingsMetadata()] }),
})

function generateLandsMetadata() {
  return { title: 'Территории', description: "Территории сервера" }
}

const landsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: LandsRouteComponent,
  path: "/lands",
  head: () => ({ meta: [generateLandsMetadata()] }),
})

const landRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: LandRouteComponent,
  path: "/lands/$id",
  loader: reatomLoader(async (context, { params }) => {
    landParamAtom(context, params.id as string)

    let data = context.get(landAtom)

    if (!data) {
      data = await take(context, landAtom)
    }

    return {
      title: data ? data?.name : 'Не найдено...',
    }
  }),
  head: ({ loaderData }) => {
    const data = loaderData as { title: string | undefined }

    return {
      meta: [{ title: data?.title ?? "Загрузка..." }],
    }
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
})

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  id: "_dashboard",
  component: DashboardRouteComponent,
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: DashboardIndexRouteComponent,
})

const dashboardProfileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/profile",
  component: DashboardProfileRouteComponent,
})

const dashboardThreadsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/threads",
  component: DashboardThreadsRouteComponent,
})

const dashboardRoutes = dashboardLayoutRoute.addChildren([
  dashboardIndexRoute,
  dashboardProfileRoute,
  dashboardThreadsRoute,
])

const categoryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: CategoryRouteComponent,
  loader: reatomLoader(async (context, { params }) => {
    categoryIdAtom(context, params.id as string)
  }),
  path: "/category/$id",
})

const createThreadRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: CreateThreadRouteComponent,
  path: "/create-thread",
  head: () => ({ meta: [{ title: 'Создать тред', }] }),
})

const createTicketRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: CreateTicketRouteComponent,
  path: "/create-ticket",
  head: () => ({ meta: [{ title: "Создать тикет" }] }),
})

export const protectedRoutes = protectedRoute.addChildren([
  adminRoutes,
  eventsRoute,
  friendsRoute,
  notificationsRoute,
  searchRoute,
  collectionRoute,
  ratingsRoute,
  landsRoute,
  landRoute,
  dashboardRoute,
  dashboardRoutes,
  categoryRoute,
  createThreadRoute,
  createTicketRoute
])