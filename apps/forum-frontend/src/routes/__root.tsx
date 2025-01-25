import { Link, Outlet, ScrollRestoration, useMatches } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from "sonner"
import { InfoIcon, WarningIcon, ErrorIcon, SuccessIcon } from "@repo/ui/src/components/toast-icons.tsx";
import '../styles/index.css'
import "@repo/ui/ui.css"
import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: TITLE,
      },
    ],
  }),
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  }
})

const TITLE = 'Fasberry';

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
      <TanStackRouterDevtools />
      <ScrollRestoration />
    </Meta>
  )
}