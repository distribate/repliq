// @ts-ignore
import '../global.css'
// @ts-ignore
import "@repo/ui/ui.css"
// @ts-ignore
import "@repo/plate-editor/src/editor.css"
// @ts-ignore
import '@mdxeditor/editor/style.css'

import { Outlet, ScrollRestoration, useMatches } from '@tanstack/react-router'
import { createRootRouteWithContext } from '@tanstack/react-router';
import { lazy, ReactNode, Suspense, useEffect } from 'react';
import { NotificationsWrapper } from '#components/notifications/components/notifications-wrapper';
import type { RouterContext } from '@repo/lib/utils/reatom-loader'

const NotFound = lazy(() => import("#components/templates/components/not-found").then(m => ({ default: m.NotFound })))
const Toaster = lazy(() => import("sonner").then(m => ({ default: m.Toaster })))
const InfoIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.InfoIcon })))
const WarningIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.WarningIcon })))
const ErrorIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.ErrorIcon })))
const SuccessIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.SuccessIcon })))

const DEFAULT_TITLE = 'Fasberry';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  head: () => ({
    meta: [{ title: DEFAULT_TITLE, description: "Fasberry" }],
  }),
  notFoundComponent: () => (
    <Suspense>
      <NotFound />
    </Suspense>
  )
})

const TanStackRouterDevtools = process.env.NODE_ENV === 'production'
  ? () => null
  : lazy(() => import('@tanstack/router-devtools').then((res) => ({ default: res.TanStackRouterDevtools })))

function Meta({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const meta = matches.at(-1)?.meta?.find((meta) => meta?.title);

  useEffect(() => {
    document.title = [meta?.title, DEFAULT_TITLE].filter(Boolean).join(' - ');
  }, [meta]);

  return children;
}

const toastOptions = {
  classNames: {
    error: "bg-black/80 text-lg text-shark-50 backdrop-blur-lg border-2 border-shark-700 rounded-md",
    success:
      "bg-black/80 text-lg backdrop-blur-lg text-shark-50 border-2 border-shark-700 rounded-md",
    warning:
      "bg-black/80 text-lg backdrop-blur-lg text-shark-50 border-2 border-shark-700 rounded-md",
    info: "bg-black/80 text-lg backdrop-blur-lg text-shark-50 border-2 border-shark-700 rounded-md",
  },
}

const TOAST_ICONS = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

function RootComponent() {
  return (
    <Meta>
      <Suspense>
        <Toaster expand={false} position="top-center" icons={TOAST_ICONS} toastOptions={toastOptions} />
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