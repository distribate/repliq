import { Outlet } from '@tanstack/react-router'
import { isStartedAtom } from '@repo/lib/queries/global-option-query';
import { lazy, Suspense } from 'react';
import { MainLayout } from '#components/layout/components/default/layout';
import { reatomComponent } from '@reatom/npm-react';

const StartPreview = lazy((() => import("#components/templates/components/start-preview").then(m => ({ default: m.StartPreview }))))

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

export function ProtectedRouteComponent() {
  return (
    <Page />
  )
}