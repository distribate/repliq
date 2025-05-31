import { MainLayout } from '#components/layout/components/default/layout'
import { Outlet } from '@tanstack/react-router'

export function PublicRouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}