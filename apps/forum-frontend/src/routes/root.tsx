import { ErrorComponent } from "#components/layout/components/default/error";
import { NotFoundComponent } from "#components/templates/components/not-found-component";
import { reatomLoader, RouterContext } from "@repo/lib/utils/reatom/reatom-loader";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { authRoute } from "./root-routes";
import { publicRoutes } from "./public-routes";
import { protectedRoutes } from "./protected-routes";
import { RootRouteComponent } from "#pages/root.page";
import { validatePage } from "./validation.model";

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
})

export const routeTree = rootRoute.addChildren([
  authRoute,
  publicRoutes,
  protectedRoutes
])