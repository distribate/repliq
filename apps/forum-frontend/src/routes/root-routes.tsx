import { reatomLoader } from "@repo/lib/utils/reatom/reatom-loader"
import { validatePage } from "@repo/lib/utils/validate-page"
import { createRoute } from "@tanstack/react-router"
import { redirect } from "@tanstack/react-router"
import { rootRoute } from "./root"
import { lazy, Suspense } from "react"

const AuthRouteComponent = lazy(() => import("#pages/auth.page").then(m => ({ default: m.AuthRouteComponent })))

type AuthSearch = Partial<{
  from: string
  redirect: string
}>

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => <Suspense><AuthRouteComponent/></Suspense>,
  beforeLoad: reatomLoader(async (context) => {
    const isValid = await validatePage(context)

    if (isValid) {
      throw redirect({ to: '/' })
    }
  }),
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    from: search.from as string ?? undefined,
    redirect: search.redirect as string ?? undefined,
  }),
  path: "/auth",
})