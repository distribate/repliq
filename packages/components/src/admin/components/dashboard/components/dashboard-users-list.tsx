"use client"

import { usersQuery } from '../queries/users-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { UserDashboardCard } from '../../../../cards/components/user-dashboard-card/user-dashboard-card.tsx';

export const DashboardUsersList = () => {
  const { data: users, isLoading } = usersQuery()
  
  if (isLoading) return <Skeleton className="w-48 h-24"/>
  
  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {!users || !users.length && <div>.</div>}
      {users?.map(user => (
        <UserDashboardCard key={user.id} {...user}/>
      ))}
    </div>
  )
}