import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router'
import { lazy, ReactNode, Suspense } from 'react'
import type { AdminSections as AdminSectionsType } from '#components/admin/navigation/admin-navigation-badge'
import { AdminNavigation } from '#components/admin/navigation/admin-navigation'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { atom } from '@reatom/core'

const NewsControl = lazy(() => import("#components/admin/news/components/admin-news-control").then(m => ({ default: m.AdminNewsControl })))
const TicketsList = lazy(() => import("#components/admin/tickets/components/admin-tickets-list").then(m => ({ default: m.AdminTicketsList })))
const ReportsList = lazy(() => import("#components/admin/reports/components/admin-reports-list").then(m => ({ default: m.AdminReportsList })))
const CreateModpack = lazy(() => import("#components/admin/modpack/components/admin-create-modpack").then(m => ({ default: m.AdminCreateModpack })))

export const Route = createLazyFileRoute('/_protected/_admin/admin/')({
  component: RouteComponent,
})

const Stats = () => {
  return (
    <>
      Stats
    </>
  )
}

const COMPONENTS: Record<AdminSectionsType, ReactNode> = {
  "tickets": <TicketsList />,
  "reports": <ReportsList />,
  "stats": <Stats />
}

const adminRoute = getRouteApi("/_protected/_admin")

export const adminSectionParamAtom = atom<AdminSectionsType | undefined>(undefined, "adminSectionParam")

export const SyncAdminSectionParam = () => {
  // @ts-expect-error
  const section = adminRoute.useSearch({ select: params => params.section }) as AdminSectionsType | undefined
  useUpdate((ctx) => adminSectionParamAtom(ctx, section), [section])
  return null;
}

const AdminDefault = reatomComponent(({ ctx }) => {
  const section = ctx.spy(adminSectionParamAtom)

  if (section) return null;

  return (
    <>
      <Suspense>
        <NewsControl />
        <CreateModpack />
      </Suspense>
    </>
  )
})

const AdminSections = reatomComponent(({ ctx }) => {
  const section = ctx.spy(adminSectionParamAtom)

  if (!section) return null;

  return (
    <Suspense>
      {section && COMPONENTS[section]}
    </Suspense>
  )
})

function RouteComponent() {
  return (
    <>
      <SyncAdminSectionParam />
      <AdminNavigation />
      <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full p-2">
        <AdminDefault />
        <AdminSections />
      </div>
    </>
  )
}