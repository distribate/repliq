import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query';
import { getUserInformation } from '@repo/lib/queries/get-user-information';
import { globalOptionQuery } from '@repo/lib/queries/global-option-query';
import { StartPreview } from '#components/templates/components/start-preview';
import { lazy, Suspense } from 'react';
import { validatePage } from '@repo/lib/utils/validate-page';
import { MainLayout } from '#components/layout/components/default/layout';
import { WindowLoader } from '@repo/ui/src/components/window-loader';

const ErrorComponent = lazy(() => import("#components/layout/components/default/error").then(m => ({ default: m.ErrorComponent })))

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const isValid = await validatePage(context.queryClient)

    if (!isValid) {
      throw redirect({ to: '/auth' })
    }
  },
  loader: async ({ context: ctx }) => {
    const isValid = await validatePage(ctx.queryClient)

    if (isValid) {
      await ctx.queryClient.ensureQueryData({
        queryKey: CURRENT_USER_QUERY_KEY, queryFn: getUserInformation,
      })
    }
  },
  errorComponent: ({ error, reset }) => (
    <Suspense>
      <ErrorComponent error={error} reset={reset} />
    </Suspense >
  ),
  pendingComponent: () => (
    <div className="flex h-dvh w-full items-center justify-center">
      <WindowLoader />
    </div>
  )
})

function RouteComponent() {
  const { data: { isStarted } } = globalOptionQuery()

  if (isStarted) return <StartPreview />

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}