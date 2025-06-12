import { Outlet } from '@tanstack/react-router'
import { MainLayout } from '#components/layout/components/default/layout';

export function ProtectedRouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}