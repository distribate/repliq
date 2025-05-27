// @ts-expect-error
import '../global.css'
// @ts-expect-error
import "@repo/ui/ui.css"
// @ts-expect-error
import "@repo/plate-editor/src/editor.css"

import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { createRootRouteWithContext } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { NotificationsWrapper } from '#components/notifications/components/notifications-wrapper';
import { reatomLoader, type RouterContext } from '@repo/lib/utils/reatom-loader'
import { validatePage } from '@repo/lib/utils/validate-page'
import { NotFoundComponent } from '#components/templates/components/not-found-component';
import { ErrorComponent } from '#components/templates/components/error-component';
import { DEFAULT_TITLE, Meta } from '#components/shared/meta';
import { isProduction } from '@repo/lib/helpers/is-production';

function generateMetadata() {
  return {
    title: DEFAULT_TITLE, 
    description: "Fasberry"
  }
}

const Toaster = lazy(() => import("#components/shared/toast").then(m => ({ default: m.Toaster })))
const TanStackRouterDevtools = isProduction
  ? () => null
  : lazy(() => import('@tanstack/router-devtools').then((res) => ({ default: res.TanStackRouterDevtools })))

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  head: () => ({ meta: [generateMetadata()] }),
})

function RootComponent() {
  return (
    <Meta>
      <Suspense>
        <Toaster />
      </Suspense>
      <NotificationsWrapper />
      <Outlet />
      <ScrollRestoration />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </Meta>
  )
}