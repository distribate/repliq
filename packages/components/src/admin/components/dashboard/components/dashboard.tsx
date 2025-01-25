import {
  DashboardUsersList,
  DashboardUsersListSkeleton,
} from "./dashboard-users-list.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DashboardCommentsList } from "./dashboard-comments-list.tsx";
import { Suspense } from "react";

export const Dashboard = () => {
  return (
    <div className="flex w-full gap-4 items-start h-full">
      <div className="flex flex-col p-4 bg-shark-900/60 rounded-md gap-2 w-3/4 h-full">
        <Typography textSize="big">Последние комментарии</Typography>
        <DashboardCommentsList />
      </div>
      <div className="flex flex-col p-4 bg-shark-900/60 rounded-md gap-2 w-1/4 h-fit">
        <Typography textSize="big">Игроки</Typography>
        <Suspense fallback={<DashboardUsersListSkeleton />}>
          <DashboardUsersList />
        </Suspense>
      </div>
    </div>
  );
};
