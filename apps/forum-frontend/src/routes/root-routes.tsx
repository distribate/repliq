import { reatomLoader, reatomOnVoid } from "@repo/lib/utils/reatom/reatom-loader"
import { createRoute } from "@tanstack/react-router"
import { redirect } from "@tanstack/react-router"
import { rootRoute } from "./root"
import { lazy, Suspense } from "react"
import { resetAuth } from "#components/auth/models/auth.model"
import { RouteSkeleton } from "#components/templates/components/route-skeleton"
import { validatePage } from "./validation.model"

const AuthRouteComponent = lazy(() => import("#pages/auth.page").then(m => ({ default: m.AuthRouteComponent })))

type AuthSearch = Partial<{
  from: string
  redirect: string
}>

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => (
    <Suspense fallback={<RouteSkeleton />}>
      <AuthRouteComponent />
    </Suspense>
  ),
  beforeLoad: reatomLoader(async (context) => {
    const isValid = await validatePage(context)

    if (isValid) {
      throw redirect({ to: '/' })
    }
  }),
  onLeave: reatomOnVoid(async (ctx) => resetAuth(ctx)),
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    from: search.from as string ?? undefined,
    redirect: search.redirect as string ?? undefined,
  }),
  path: "/auth",
})