import { lazy, ReactNode, Suspense } from 'react'
import { AdminNavigation } from '#components/admin/navigation/admin-navigation'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { atom } from '@reatom/core'
import { usePageContext } from 'vike-react/usePageContext'

const TicketsList = lazy(() => import("#components/admin/tickets/components/admin-tickets-list").then(m => ({ default: m.AdminTicketsList })))
const ReportsList = lazy(() => import("#components/admin/reports/components/admin-reports-list").then(m => ({ default: m.AdminReportsList })))

type Types = "tickets" | "reports" | "stats"

const Stats = () => {
  return (
    <>
      Stats
    </>
  )
}

const COMPONENTS: Record<Types, ReactNode> = {
  "tickets": <TicketsList />,
  "reports": <ReportsList />,
  "stats": <Stats />
}

const adminSectionParamAtom = atom<Types | undefined>(undefined, "adminSectionParam")

const SyncAdminSectionParam = () => {
  const section = usePageContext().urlParsed.search.section as Types
  useUpdate((ctx) => adminSectionParamAtom(ctx, section), [section])
  return null;
}

const AdminSections = reatomComponent(({ ctx }) => {
  const section = ctx.spy(adminSectionParamAtom)

  if (!section) return null;

  return (
    <Suspense>
      {section && COMPONENTS[section]}
    </Suspense>
  )
}, "AdminSections")

export default function AdminIndexRouteComponent() {
  return (
    <>
      <SyncAdminSectionParam />
      <AdminNavigation />
      <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full p-2">
        <AdminSections />
      </div>
    </>
  )
}