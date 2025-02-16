import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/misc/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/misc/about"!</div>
}
