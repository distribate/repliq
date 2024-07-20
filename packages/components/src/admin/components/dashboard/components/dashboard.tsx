import { DashboardUsersList } from './dashboard-users-list.tsx';

export const Dashboard = async () => {
  return (
    <div className="flex w-full h-full">
      <DashboardUsersList/>
    </div>
  )
}