import { ErrorComponent } from "#components/layout/components/default/error";
import { RootRouteComponent } from "#components/shared/__root";
import { DEFAULT_TITLE } from "#components/shared/meta";
import { NotFoundComponent } from "#components/templates/components/not-found-component";
import { reatomLoader, RouterContext } from "@repo/lib/utils/reatom-loader";
import { validatePage } from "@repo/lib/utils/validate-page";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { authRoute } from "./root-routes";
import { publicRoutes } from "./public-routes";
import { protectedRoutes } from "./protected-routes";

function generateRootMetadata() {
  return {
    title: DEFAULT_TITLE,
    description: "Fasberry"
  }
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  head: () => ({ meta: [generateRootMetadata()] }),
})

export const routeTree = rootRoute.addChildren([
  authRoute,
  publicRoutes,
  protectedRoutes
])