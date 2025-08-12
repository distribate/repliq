import { reatomComponent } from "@reatom/npm-react";
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
import { userCoverSelectedAvatarAtom } from "#components/profile/header/models/avatar.model";
import { userAvatars } from "../models/user-avatars.model";

export const AvatarsList = reatomComponent(({ ctx }) => {
  const init = ctx.spy(requestedUserAtom)?.avatar;
  if (!init) return null;

  const data = ctx.spy(userAvatars.dataAtom);
  const avatars = !data ? [init] : data.avatars;

  return (
    <div
      className="flex sm:justify-center justify-start items-center gap-2 overflow-x-auto overflow-y-hidden sm:w-full 
        h-24 max-h-24 *:cursor-pointer"
    >
      {avatars.map((avatar, idx) => (
        <div
          key={idx}
          onClick={() => userCoverSelectedAvatarAtom(ctx, avatar)}
        >
          <img
            src={avatar}
            alt={idx.toString()}
            loading="lazy"
            draggable={false}
            className="w-24 h-24 select-none max-h-24 min-w-24 min-h-24 aspect-square rounded-lg"
          />
        </div>
      ))}
    </div>
  )
}, "List")