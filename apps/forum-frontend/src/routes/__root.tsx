import { Outlet, ScrollRestoration, useMatches } from '@tanstack/react-router'
import { toast, Toaster } from "sonner"
import { InfoIcon, WarningIcon, ErrorIcon, SuccessIcon } from "@repo/ui/src/components/toast-icons.tsx";
import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { lazy, ReactNode, Suspense, useEffect } from 'react';
// @ts-ignore
import '../styles/index.css'
// @ts-ignore
import "@repo/ui/ui.css"
import type { NotificationsEventsPayload, ConfigEventsData } from "@repo/types/entities/notifications-events-type.ts"
import { globalOptionQuery } from '@repo/lib/queries/global-option-query';
import { config, updateEvent, ping } from "@repo/shared/constants/sse-events.ts"
import { isProduction } from '@repo/lib/helpers/is-production';

const NotFound = lazy(() => import("#components/templates/not-found.tsx")
  .then(m => ({ default: m.NotFound }))
)

const TITLE = 'Fasberry';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  head: () => ({
    meta: [
      { title: TITLE, description: "Fasberry" },
    ],
  }),
  notFoundComponent: () => (
    <Suspense>
      <NotFound />
    </Suspense>
  )
})

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production' ? () => null : lazy(() =>
    import('@tanstack/router-devtools').then((res) => ({
      default: res.TanStackRouterDevtools,
    })),
  )

function Meta({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const meta = matches.at(-1)?.meta?.find((meta) => meta?.title);

  useEffect(() => {
    document.title = [meta?.title, TITLE].filter(Boolean).join(' - ');
  }, [meta]);

  return children;
}

const URL = isProduction ? "https://cc.fasberry.su/api/forum/sse" : "http://localhost:4101/api/forum/sse"

const NotificationsWrapper = () => {
  const { isAuthenticated } = globalOptionQuery().data

  useEffect(() => {
    if (isAuthenticated) {
      const es = new EventSource(URL, { withCredentials: true });

      // es.onopen = () => console.log(">>> Connection opened!");

      es.addEventListener(config, (event) => {
        const data: ConfigEventsData = event.data;

        if (data === 'Exit') es.close();
      })

      es.addEventListener(ping, () => { });

      es.addEventListener(updateEvent, (event) => {
        const data: NotificationsEventsPayload = JSON.parse(event.data);

        toast[data.data.status](data.data.message)
      });

      return () => es.close();
    }
  }, [isAuthenticated])

  return <></>
}

function RootComponent() {
  return (
    <Meta>
      <Toaster
        expand={false}
        position="top-left"
        icons={{
          info: <InfoIcon />,
          success: <SuccessIcon />,
          warning: <WarningIcon />,
          error: <ErrorIcon />,
        }}
        toastOptions={{
          classNames: {
            error: "bg-black/80 text-lg text-shark-50 backdrop-blur-lg border-2 border-shark-700 rounded-md",
            success:
              "bg-black/80 text-lg backdrop-blur-lg text-shark-50 border-2 border-shark-700 rounded-md",
            warning:
              "bg-black/80 text-lg backdrop-blur-lg text-shark-50 border-2 border-shark-700 rounded-md",
            info: "bg-black/80 text-lg backdrop-blur-lg text-shark-50 border-2 border-shark-700 rounded-md",
          },
        }}
      />
      <NotificationsWrapper />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      <ScrollRestoration />
    </Meta>
  )
}