import { AdminSections } from '#components/admin/navigation/components/admin-navigation-badge';
import { forumUserClient } from '@repo/shared/api/forum-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

async function validateAdmin() {
  const res = await forumUserClient.user["get-is-admin"].$get()
  const data = await res.json()

  if (!data || "error" in data) {
    return false;
  }

  if (data.data) {
    return true
  }

  return false;
}

type AdminSearch = {
  section?: AdminSections
}

export const Route = createFileRoute('/_protected/_admin')({
  component: RouteComponent,
  beforeLoad: async () => {
    const isValid = await validateAdmin()

    if (!isValid) {
      throw redirect({ to: "/" })
    }
  },
  validateSearch: (search: Record<string, unknown>): AdminSearch => ({
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