// @ts-expect-error
import '../global.css'
// @ts-expect-error
import "@repo/ui/ui.css"
// @ts-expect-error
import "@repo/plate-editor/src/editor.css"
// @ts-expect-error
import '@bprogress/core/css';

import { Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react';
import { NotificationsWrapper } from '#components/notifications/components/notifications-wrapper';
import { isProduction } from '@repo/lib/helpers/is-production';
import { Head } from '@unhead/react';
import { KEYWORDS, PREVIEW_IMAGE } from '@repo/shared/constants/meta';

const Toaster = lazy(() => import("#components/shared/toast").then(m => ({ default: m.Toaster })))
const TanStackRouterDevtools = isProduction
  ? () => null
  : lazy(() => import('@tanstack/router-devtools').then((res) => ({ default: res.TanStackRouterDevtools })))

export function RootRouteComponent() {
  return (
    <>
      <Head>
        <meta name="keywords" content={KEYWORDS} />
        <meta name="author" content="Fasberry Project" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fasberry" />
        <meta property="og:site_name" content="Fasberry" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fasberry" />
        <meta name="twitter:description" content="Fasberry - майнкрафт сервер" />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
      </Head>
      <Suspense>
        <Toaster />
      </Suspense>
      <NotificationsWrapper />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  )
}