import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query';
import { getUserInformation } from '@repo/lib/queries/get-user-information';
import { globalOptionQuery } from '@repo/lib/queries/global-option-query';
import { StartPreview } from '#components/get-start/start-preview';
import { lazy, Suspense } from 'react';
import { validatePage } from '@repo/lib/utils/validate-page';
import { MainLayout } from '#components/layout/default/layout';
import { Skeleton } from '@repo/ui/src/components/skeleton';

const ErrorComponent = lazy(() => import("#components/layout/default/error").then(m => ({ default: m.ErrorComponent })))

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
  errorComponent: ({ error, reset }) => {
    return (
      <Suspense>
        <ErrorComponent error={error} reset={reset} />
      </Suspense>
    )
  },
  pendingComponent: () => <Skeleton className="w-full h-full"/>
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