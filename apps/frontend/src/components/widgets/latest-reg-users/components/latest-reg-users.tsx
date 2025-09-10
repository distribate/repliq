import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";
import { LatestRegUsersPayload, latestUsersAction } from "../models/latest-reg-users.model";
import { UserCardModal } from "#components/modals/custom/user-card-modal";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#shared/helpers/create-link";

onConnect(latestUsersAction.dataAtom, (ctx) => latestUsersAction(ctx, { limit: 6 }))

const LatestRegUsersSkeleton = () => {
  return (
    <>
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </>
  )
}

const LatestRegUserItem = reatomComponent<LatestRegUsersPayload[number]>(({ ctx, ...user }) => {
  return (
    <div className="flex items-center w-full gap-2">
      <UserCardModal
        nickname={user.nickname}
        withCustomTrigger={true}
        trigger={
          <Avatar
            url={user.avatar}
            nickname={user.nickname}
            propHeight={50}
            propWidth={50}
            className="min-h-12 h-12 max-h-12 aspect-square"
          />
        }
      />
      <div className="flex flex-col">
        <CustomLink to={createIdLink("user", user.nickname)}>
          <Typography>
            {user.nickname}
          </Typography>
        </CustomLink>
      </div>
    </div>
  )
}, "LatestRegUserItem")

export const LatestRegUsers = reatomComponent(({ ctx }) => {
  const data = ctx.spy(latestUsersAction.dataAtom)

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold select-none">
        Новые пользователи
      </Typography>
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
        {ctx.spy(latestUsersAction.statusesAtom).isPending && <LatestRegUsersSkeleton />}
        {data && data.map(user => <LatestRegUserItem key={user.nickname} {...user} />)}
      </div>
    </div>
  );
}, "LatestRegUsers")