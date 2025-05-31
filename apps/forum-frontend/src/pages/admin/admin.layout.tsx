import { Outlet } from '@tanstack/react-router'
import { Head } from '@unhead/react'

export function AdminRouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full min-h-dvh">
      <Head>
        <title>Админ-панель</title>
      </Head>
      <Outlet />
    </div>
  )
}