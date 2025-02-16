import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/misc/status')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/misc/status"!</div>
}
