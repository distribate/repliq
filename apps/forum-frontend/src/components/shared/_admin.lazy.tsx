import { Outlet } from '@tanstack/react-router'

export function AdminRouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full min-h-dvh">
      <Outlet />
    </div>
  )
}