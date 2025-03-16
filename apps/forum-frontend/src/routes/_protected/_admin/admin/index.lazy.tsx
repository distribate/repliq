import { createLazyFileRoute, useSearch } from '@tanstack/react-router'
import { Typography } from '@repo/ui/src/components/typography'
import { lazy, ReactNode, Suspense } from 'react'
import type { AdminSections } from '#components/admin/navigation/admin-navigation-badge'

export const Route = createLazyFileRoute('/_protected/_admin/admin/')({
  component: RouteComponent,
})

const AdminNavigation = lazy(() => import("#components/admin/navigation/admin-navigation.tsx").then(m => ({ default: m.AdminNavigation })))
const AdminNewsControl = lazy(() => import("#components/admin/news/admin-news-control.tsx").then(m => ({ default: m.AdminNewsControl })))
const AdminTicketsList = lazy(() => import("#components/admin/tickets/admin-tickets-list.tsx").then(m => ({ default: m.AdminTicketsList })))
const AdminReportsList = lazy(() => import("#components/admin/reports/admin-reports-list.tsx").then(m => ({ default: m.AdminReportsList })))

const CreateModpack = () => {
  return (
    <div className="flex flex-col gap-4 items-start justify-center w-full p-4 border-2 border-shark-800 rounded-lg">
      <Typography textSize="big" className="font-semibold">
        Публикация модпака
      </Typography>
      <div className="flex flex-col gap-2 w-full">

      </div>
    </div>
  )
}

const ADMIN: Record<AdminSections, ReactNode> = {
  "tickets": <AdminTicketsList />,
  "reports": <AdminReportsList />,
  "stats": "s"
}

function RouteComponent() {
  const section = useSearch({ select: s => s.section, from: "/_protected/_admin" })

  return (
    <>
      <Suspense>
        <AdminNavigation />
      </Suspense>
      <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full p-2">
        {!section && (
          <>
            <AdminNewsControl />
            <CreateModpack />
          </>
        )}
        {section && ADMIN[section]}
      </div>
    </>
  )
}