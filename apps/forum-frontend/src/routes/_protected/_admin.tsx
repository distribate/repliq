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

export const Route = createFileRoute('/_protected/_admin')({
  component: RouteComponent,
  beforeLoad: async () => {
    const isAdmin = await validateAdmin()

    console.log(isAdmin)

    if (!isAdmin) {
      throw redirect({
        to: "/",
      })
    }
  }
})

function RouteComponent() {
  return (
    <>
      <Outlet/>
    </>
  )
}