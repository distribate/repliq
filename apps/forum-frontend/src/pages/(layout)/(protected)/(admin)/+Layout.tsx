import { AdminNavigation } from "#components/admin/navigation/admin-navigation";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full min-h-dvh">
      <AdminNavigation />
      <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full p-2">
        {children}
      </div>
    </div>
  )
}