import { reatomComponent } from "@reatom/npm-react";
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
import { userAvatarSelectedAtom, userAvatarsSelectedAtom } from "#components/user/components/avatar/models/avatar.model";
import { userAvatars } from "../models/user-avatars.model";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export const AvatarsList = reatomComponent<{ nickname: string }>(({ ctx, nickname }) => {
  const init = ctx.spy(requestedUserAtom)?.avatar;
  if (!init) return null;

  if (ctx.spy(userAvatars.statusesAtom).isPending) {
    return (
      <>
        <Skeleton className="h-24 aspect-square rounded-lg" />
        <Skeleton className="h-24 aspect-square rounded-lg" />
        <Skeleton className="h-24 aspect-square rounded-lg" />
      </>
    )
  }

  const data = ctx.spy(userAvatarsSelectedAtom);
  
  const avatars = !data ? [init] : data;

  return (
    avatars.map((avatar, idx) => (
      <div key={idx} onClick={() => userAvatarSelectedAtom(ctx, avatar)} className="flex-shrink-0">
        <img
          src={avatar}
          loading="lazy"
          draggable={false}
          className="h-24 object-cover cursor-pointer select-none aspect-square rounded-lg"
          alt=""
        />
      </div>
    ))
  )
}, "List")