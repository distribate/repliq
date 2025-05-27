import { createFileRoute, Outlet } from '@tanstack/react-router'
import { isStartedAtom } from '@repo/lib/queries/global-option-query';
import { lazy, Suspense } from 'react';
import { validatePage } from '@repo/lib/utils/validate-page';
import { MainLayout } from '#components/layout/components/default/layout';
import { reatomComponent } from '@reatom/npm-react';
import { reatomLoader } from '@repo/lib/utils/reatom-loader';
import { RouteSkeleton } from '#components/templates/components/route-skeleton';

const StartPreview = lazy((() => import("#components/templates/components/start-preview").then(m => ({ default: m.StartPreview }))))

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx, "redirect")),
  pendingComponent: () => <RouteSkeleton/>
})

const Page = reatomComponent(({ ctx }) => {
  const isStarted = ctx.spy(isStartedAtom)

  if (isStarted) {
    return (
      <Suspense>
        <StartPreview />
      </Suspense>
    )
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}, "RouteComponent")

function RouteComponent() {
  return (
    <Page />
  )
}