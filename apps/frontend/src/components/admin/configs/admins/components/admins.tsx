import { onConnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { adminsListAction } from "../models/admins.model";
import { UserNickname } from "#components/user/components/name/nickname";
import { Typography } from "@repo/ui/src/components/typography";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";

onConnect(adminsListAction.dataAtom, adminsListAction)

export const AdminsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(adminsListAction.dataAtom);

  if (ctx.spy(adminsListAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) return null;

  return (
    data.map((user) => (
      <div
        key={user.nickname}
        className="flex bg-shark-900 rounded-lg p-2 items-center w-full"
      >
        <UserNickname nickname={user.nickname} />
        <Typography>
          {user.description}
        </Typography>
      </div>
    ))
  )
}, "AdminsList")