import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserPreviewCard } from "#components/cards/user-preview-card/components/user-preview-card";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";
import { latestUsersAction } from "./last-res-users.model";

onConnect(latestUsersAction.dataAtom, (ctx) => latestUsersAction(ctx, { limit: 6 }))

export const LastRegUsers = reatomComponent(({ ctx }) => {
  const lastUsers = ctx.spy(latestUsersAction.dataAtom)
  const isLoading = ctx.spy(latestUsersAction.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold select-none"
      >
        Новые пользователи 💿
      </Typography>
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
        {isLoading && (
          <>
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </>
        )}
        {lastUsers && lastUsers.map(user => <UserPreviewCard key={user.nickname} {...user} />)}
      </div>
    </div>
  );
}, "LatestRegUsers")