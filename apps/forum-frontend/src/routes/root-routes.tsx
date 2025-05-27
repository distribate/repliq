import { AuthRouteComponent, AuthSearch } from "#components/shared/auth"
import { reatomLoader } from "@repo/lib/utils/reatom-loader"
import { validatePage } from "@repo/lib/utils/validate-page"
import { createRoute } from "@tanstack/react-router"
import { redirect } from "@tanstack/react-router"
import { rootRoute } from "./__root"

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: AuthRouteComponent,
  beforeLoad: reatomLoader(async (context) => {
    const isValid = await validatePage(context)
    if (isValid) throw redirect({ to: '/' })
  }),
  head: () => ({ meta: [{ title: 'Авторизация' }] }),
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    from: search.from as string ?? undefined,
    redirect: search.redirect as string ?? undefined,
  }),
  path: "/auth",
})