import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_protected/dashboard/profile"!</div>
  )
}
