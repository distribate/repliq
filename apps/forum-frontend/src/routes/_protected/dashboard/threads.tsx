import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/threads')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_protected/dashboard/threads"!</div>
  )
}
