import { Outlet, ScrollRestoration, useMatches } from '@tanstack/react-router'
import { Toaster } from "sonner"
import { InfoIcon, WarningIcon, ErrorIcon, SuccessIcon } from "@repo/ui/src/components/toast-icons.tsx";
import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { lazy, ReactNode, Suspense, useEffect } from 'react';

// @ts-ignore
import '../styles/index.css'
// @ts-ignore
import "@repo/ui/ui.css"

const NotFound = lazy(() => 
  import("#components/templates/not-found.tsx").then(m => ({ default: m.NotFound }))
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: TITLE,
        description: "Fasberry",
      },
    ],
  }),
  notFoundComponent: () => {
    return (
      <Suspense>
        <NotFound />
      </Suspense>
    )
  }
})

const TITLE = 'Fasberry';

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
            error: "bg-black/80 text-shark-50 backdrop-blur-lg border-2 border-shark-800 rounded-lg",
            success:
              "bg-black/80 backdrop-blur-lg text-shark-50 border-2 border-shark-800 rounded-lg",
            warning:
              "bg-black/80 backdrop-blur-lg text-shark-50 border-2 border-shark-800 rounded-lg",
            info: "bg-black/80 backdrop-blur-lg text-shark-50 border-2 border-shark-800 rounded-lg",
          },
        }}
      />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      <ScrollRestoration />
    </Meta>
  )
}