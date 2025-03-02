import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserPreviewCard } from "#components/cards/user-preview-card/user-preview-card";
import { latestUsersQuery } from "@repo/lib/queries/last-reg-users-query";

export const LastRegUsers = () => {
  const { data: lastUsers, isLoading } = latestUsersQuery();

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
};