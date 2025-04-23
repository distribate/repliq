import { ContentNotFound } from '#components/templates/components/content-not-found'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/_dashboard/threads')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ContentNotFound title="Пока ничего нет :/" />
  )
}