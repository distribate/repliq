import { reatomLoader } from "@repo/lib/utils/reatom/reatom-loader";
import { createRoute, redirect } from "@tanstack/react-router";
import { AdminSections } from "#components/admin/navigation/admin-navigation-badge";
import { DEFAULT_TYPE_PARAM, searchTypeParamAtom } from "#components/search/models/search-related.model";
import { logger } from "@repo/lib/utils/logger";
import { CollectionParams } from "#components/collection/components/navigation/components/collection-navigation";
import { categoryIdAtom } from "#components/categories/components/threads/models/category.model";
import { rootRoute } from "./root";
import { Params } from "#pages/search.page";
import { ProtectedRouteComponent } from "#pages/protected.layout";
import { RouteSkeleton } from "#components/templates/components/route-skeleton";
import { lazy, Suspense } from "react";
import { validateAdmin, validatePage } from "./validation.model";

const CreateThreadRouteComponent = lazy(() => import("#pages/create-thread.page").then(m => ({ default: m.CreateThreadRouteComponent })))
const AdminRouteComponent = lazy(() => import("#pages/admin/admin.layout").then(m => ({ default: m.AdminRouteComponent })))
const AdminConfigRouteComponent = lazy(() => import("#pages/admin/config.page").then(m => ({ default: m.AdminConfigRouteComponent })))
const AdminIndexRouteComponent = lazy(() => import("#pages/admin/index.page").then(m => ({ default: m.AdminIndexRouteComponent })))
const AdminStatsRouteComponent = lazy(() => import("#pages/admin/stats.page").then(m => ({ default: m.AdminStatsRouteComponent })))
const AdminSupportRouteComponent = lazy(() => import("#pages/admin/support.page").then(m => ({ default: m.AdminSupportRouteComponent })))
const AdminDashboardRouteComponent = lazy(() => import("#pages/admin/dashboard.page").then(m => ({ default: m.AdminDashboardRouteComponent })))
const CreateTicketRouteComponent = lazy(() => import("#pages/create-ticket.page").then(m => ({ default: m.CreateTicketRouteComponent })))
const FriendsRouteComponent = lazy(() => import("#pages/friends.page").then(m => ({ default: m.FriendsRouteComponent })))
const NotificationsRouteComponent = lazy(() => import("#pages/notifications.page").then(m => ({ default: m.NotificationsRouteComponent })))
const DashboardRouteComponent = lazy(() => import("#pages/dashboard/dashboard.layout").then(m => ({ default: m.DashboardRouteComponent })))
const DashboardIndexRouteComponent = lazy(() => import("#pages/dashboard/index.page").then(m => ({ default: m.DashboardIndexRouteComponent })))
const DashboardProfileRouteComponent = lazy(() => import("#pages/dashboard/profile.page").then(m => ({ default: m.DashboardProfileRouteComponent })))
const DashboardThreadsRouteComponent = lazy(() => import("#pages/dashboard/threads.page").then(m => ({ default: m.DashboardThreadsRouteComponent })))
const CollectionRouteComponent = lazy(() => import("#pages/collection.page").then(m => ({ default: m.CollectionRouteComponent })))
const CategoryRouteComponent = lazy(() => import("#pages/category.page").then(m => ({ default: m.CategoryRouteComponent })))
const SearchRouteComponent = lazy(() => import("#pages/search.page").then(m => ({ default: m.SearchRouteComponent })))

export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ProtectedRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx, "redirect")),
  pendingComponent: () => <RouteSkeleton />,
  id: '_protected',
})

export const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/admin",
})

export const adminLayoutRoute = createRoute({
  getParentRoute: () => adminRoute,
  component: () => <Suspense><AdminRouteComponent /></Suspense>,
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
  getParentRoute: () => adminLayoutRoute,
  component: () => <Suspense><AdminIndexRouteComponent /></Suspense>,
  path: "/",
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  component: () => <Suspense><AdminDashboardRouteComponent /></Suspense>,
  path: "/dashboard",
})

const adminConfigRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  component: () => <Suspense><AdminConfigRouteComponent /></Suspense>,
  path: "/configs"
})

const adminStatsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  component: () => <Suspense><AdminStatsRouteComponent /></Suspense>,
  path: "/stats"
})

const adminSupportRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  component: () => <Suspense><AdminSupportRouteComponent /></Suspense>,
  path: "/support"
})

const friendsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><FriendsRouteComponent /></Suspense>,
  path: "/friends",
})

const notificationsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><NotificationsRouteComponent /></Suspense>,
  path: "/notifications",
})

const searchRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><SearchRouteComponent/></Suspense>,
  path: "/search",
  loader: reatomLoader(async (context, { location }) => {
    const { type } = location.search as { type: Params["type"] }

    searchTypeParamAtom(context, type)
  }),
  validateSearch: (search: Record<string, unknown>): Params => ({
    type: search.type as Params["type"] ?? DEFAULT_TYPE_PARAM,
    query: search.query as string | undefined ?? undefined
  })
})

const DEFAULT_COLLECTION_TYPE = "purchases"

const collectionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><CollectionRouteComponent/></Suspense>,
  path: "/collection",
  loader: reatomLoader(async (_, { params }) => logger.info(params)),
  validateSearch: (search: Record<string, string>): { type: CollectionParams["type"] } => ({
    type: (search.type as CollectionParams["type"]) || DEFAULT_COLLECTION_TYPE
  })
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute, 
  path: "/dashboard",
})

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  id: "_dashboard",
  component: () => <Suspense><DashboardRouteComponent /></Suspense>,
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: () => <Suspense><DashboardIndexRouteComponent /></Suspense>,
})

const dashboardProfileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/profile",
  component: () => <Suspense><DashboardProfileRouteComponent /></Suspense>,
})

const dashboardThreadsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/threads",
  component: () => <Suspense><DashboardThreadsRouteComponent /></Suspense>,
})

const categoryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><CategoryRouteComponent/></Suspense>,
  loader: reatomLoader(async (context, { params }) => categoryIdAtom(context, params.id as string)),
  path: "/category/$id",
})

const createThreadRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><CreateThreadRouteComponent /></Suspense>,
  path: "/create-thread",
})

const createTicketRoute = createRoute({
  getParentRoute: () => protectedRoute,
  component: () => <Suspense><CreateTicketRouteComponent /></Suspense>,
  path: "/create-ticket",
})

const adminRoutes = adminLayoutRoute.addChildren([
  adminIndexRoute,
  adminDashboardRoute,
  adminConfigRoute,
  adminStatsRoute,
  adminSupportRoute
])

const dashboardRoutes = dashboardLayoutRoute.addChildren([
  dashboardIndexRoute,
  dashboardProfileRoute,
  dashboardThreadsRoute,
])

export const protectedRoutes = protectedRoute.addChildren([
  adminRoute,
  adminRoutes,
  friendsRoute,
  notificationsRoute,
  searchRoute,
  collectionRoute,
  dashboardRoute,
  dashboardRoutes,
  categoryRoute,
  createThreadRoute,
  createTicketRoute
])