import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/misc/referal-system')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/misc/referal-system"!</div>
}
