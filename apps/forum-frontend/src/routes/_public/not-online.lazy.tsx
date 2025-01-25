import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/not-online')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(config)/not-online"!</div>
}
