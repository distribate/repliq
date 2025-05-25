import { AdminSections } from '#components/admin/navigation/admin-navigation-badge';
import { forumUserClient } from '@repo/shared/api/forum-client'
import { createLazyFileRoute, Outlet, redirect } from '@tanstack/react-router'

async function validateAdmin() {
  const res = await forumUserClient.user["get-is-admin"].$get()
  const data = await res.json()

  if (!data || "error" in data) return false;
  if (data.data) return true

  return false
}

export const Route = createLazyFileRoute('/_protected/_admin')({
  component: RouteComponent,
  // @ts-ignore
  beforeLoad: async () => {
    const isValid = await validateAdmin()
    if (!isValid) throw redirect({ to: "/" })
  },
  // @ts-ignore
  validateSearch: (search: Record<string, unknown>): { section?: AdminSections } => ({
    section: search.section as AdminSections ?? undefined
  })
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full min-h-dvh">
      <Outlet />
    </div>
  )
}