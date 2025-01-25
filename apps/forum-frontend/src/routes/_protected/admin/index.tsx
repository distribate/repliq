import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminNavigation } from "@repo/components/src/admin/components/navigation/admin-navigation.tsx";

export const Route = createFileRoute("/_protected/admin/")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    redirect({
      to: ".",
    })
  },
})

function RouteComponent() {
  return (
    <div className="flex flex-col bg-shark-950 gap-6 p-2 rounded-[12px] w-full h-full">
      <AdminNavigation />
    </div>
  )
}
