import { usersQuery } from "../queries/users-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserDashboardCard } from "../../../../cards/components/user-dashboard-card/user-dashboard-card.tsx";
import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DashboardUsersListPagination } from "./dashboard-users-list-pagination.tsx";

export const USERS_QUERY_KEY = "users-page";

const LIMIT_USERS_PER_PAGE = 6;

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

export const DashboardUsersList = () => {
  const searchParams = useSearch({
    from: "/admin/dashboard",
    select: (params) => params[USERS_QUERY_KEY] || "0",
  });

  const start = Number(searchParams) * 6;
  const end = start + 6;

  const {
    data: users,
    isLoading,
    refetch,
  } = usersQuery({
    range: [start, end],
    limit: LIMIT_USERS_PER_PAGE,
  });

  useEffect(() => {
    refetch();
  }, [searchParams]);

  if (isLoading) return <DashboardUsersListSkeleton />;

  return (
    <>
      
    </>
    // users &&
    // users.data && (
    //   <div className="flex flex-col gap-4 w-full min-h-full">
    //     <div className="flex flex-col gap-2 w-full h-full">
    //       {users.data.map((user) => (
    //         <UserDashboardCard key={user.id} {...user} />
    //       ))}
    //     </div>
    //     <Separator />
    //     <DashboardUsersListPagination length={users.count} />
    //   </div>
    // )
  );
};
