import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminNavigation } from '#components/admin/navigation/admin-navigation.tsx'
import { Typography } from '@repo/ui/src/components/typography'
import { AdminNewsControl } from '#components/admin/news/admin-news-control'
import { AdminTicketsList } from '#components/admin/tickets/admin-tickets-list.tsx'
import { AdminReportsList } from '#components/admin/reports/admin-reports-list.tsx'

export const Route = createLazyFileRoute('/_protected/_admin/admin/')({
  component: RouteComponent,
})

const CreateModpack = () => {
  return (
    <div className="flex flex-col gap-2 w-full">

    </div>
  )
}

function RouteComponent() {
  // @ts-ignore
  const { section } = Route.useSearch() as { section: "tickets" | "reports" | "stats" }

  return (
    <div className="flex flex-col bg-primary-color gap-6 p-2 rounded-lg w-full h-full">
      <AdminNavigation />
      {!section && (
        <>
          <AdminNewsControl />
          <div className="flex flex-col gap-4 items-start justify-center w-full p-4 border-2 border-shark-800 rounded-lg">
            <Typography textSize="big" className="font-semibold">
              Публикация модпака
            </Typography>
            <CreateModpack />
          </div>
        </>
      )}
      {section === 'tickets' && (
        <>
          <AdminTicketsList/>
        </>
      )}
      {section === 'reports' && (
        <>
          <AdminReportsList/>
        </>
      )}
      {section === 'stats' && (
        <>
          stats
        </>
      )}
    </div>
  )
}