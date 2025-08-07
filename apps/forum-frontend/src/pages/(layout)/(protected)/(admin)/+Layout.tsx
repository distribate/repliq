import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full min-h-dvh">
      {children}
    </div>
  )
}