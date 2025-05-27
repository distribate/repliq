// @ts-expect-error
import '../../global.css'
// @ts-expect-error
import "@repo/ui/ui.css"
// @ts-expect-error
import "@repo/plate-editor/src/editor.css"

import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { lazy, Suspense } from 'react';
import { NotificationsWrapper } from '#components/notifications/components/notifications-wrapper';
import { Meta } from '#components/shared/meta';
import { isProduction } from '@repo/lib/helpers/is-production';

const Toaster = lazy(() => import("#components/shared/toast").then(m => ({ default: m.Toaster })))
const TanStackRouterDevtools = isProduction
  ? () => null
  : lazy(() => import('@tanstack/router-devtools').then((res) => ({ default: res.TanStackRouterDevtools })))

export function RootRouteComponent() {
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