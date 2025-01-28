import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminNavigation } from '@repo/components/src/admin/components/navigation/admin-navigation.tsx'

export const Route = createLazyFileRoute('/_protected/_admin/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col bg-shark-950 gap-6 p-2 rounded-[12px] w-full h-full">
      <AdminNavigation />
    </div>
  )
}
