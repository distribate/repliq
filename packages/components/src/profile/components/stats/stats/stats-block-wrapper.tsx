import { ReactNode } from 'react';

export const StatsBlockWrapper = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <div className="flex flex-col w-full gap-y-1 rounded-md bg-shark-950 px-4 py-2">
      {children}
    </div>
  )
}