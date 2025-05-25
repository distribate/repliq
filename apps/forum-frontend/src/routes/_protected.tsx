import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { globalOptionsAtom } from '@repo/lib/queries/global-option-query';
import { lazy, Suspense } from 'react';
import { validatePage } from '@repo/lib/utils/validate-page';
import { MainLayout } from '#components/layout/components/default/layout';
import { WindowLoader } from '@repo/ui/src/components/window-loader';
import { reatomComponent } from '@reatom/npm-react';
import { reatomLoader } from '@repo/lib/utils/reatom-loader';
import { currentUserResource } from '@repo/lib/helpers/get-user';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes';

const ErrorComponent = lazy(() => import("#components/layout/components/default/error").then(m => ({ default: m.ErrorComponent })))
const StartPreview = lazy((() => import("#components/templates/components/start-preview").then(m => ({ default: m.StartPreview }))))

export const Route = createFileRoute('/_protected')({
  component: reatomComponent(({ ctx }) => {
    const { isStarted } = ctx.spy(globalOptionsAtom)

    if (isStarted) return <Suspense><StartPreview /></Suspense>

    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    )
  }, "RouteComponent"),
  beforeLoad: reatomLoader(async (context) => {
    const isValid = await validatePage(context)
    if (!isValid) throw redirect({ to: AUTH_REDIRECT })
  }),
  loader: reatomLoader(async (context) => {
    const isValid = await validatePage(context)
    if (isValid) await currentUserResource(context)
  }),
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