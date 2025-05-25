import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { getRouteApi } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { usersAction, usersAtom } from "../models/users.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { DashboardUsersListPagination } from "./dashboard-users-list-pagination.tsx";

export const DashboardUsersListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col gap-2 w-full h-full">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Separator />
      <Skeleton className="h-16 w-full" />
    </div>
  );
};

const dashboardRoute = getRouteApi("/_protected/_admin/admin/dashboard")

export const DashboardUsersList = reatomComponent(({ ctx }) => {
  if (ctx.spy(usersAction.statusesAtom).isPending) return <DashboardUsersListSkeleton />;

  const users = ctx.spy(usersAtom)

  if (!users) return null;

  return (
    <>
      <div className="flex flex-col gap-4 w-full min-h-full">
        <div className="flex flex-col gap-2 w-full h-full">
          {/* {users.map((user) => (
            <UserDashboardCard key={user.id} {...user} />
          ))} */}
        </div>
        <Separator />
        <DashboardUsersListPagination length={users.length} />
      </div>
    </>
  );
}, "DashboardUsersList")