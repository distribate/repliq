import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { threadOwnerAtom } from "#components/thread/thread-main/models/thread.model";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";

export const ThreadCreator = reatomComponent(({ ctx }) => {
  const threadOwner = ctx.spy(threadOwnerAtom)
  if (!threadOwner) return null;

  return (
    <div className="flex items-start gap-2 w-full">
      <CustomLink to={USER_URL + threadOwner.nickname}>
        <Avatar nickname={threadOwner.nickname} propWidth={56} propHeight={56} />
      </CustomLink>
      <div className="flex flex-col items-start w-fit gap-1">
        <CustomLink to={USER_URL + threadOwner.nickname}>
          <UserNickname nickname={threadOwner.nickname} nicknameColor={threadOwner.name_color ?? undefined} />
        </CustomLink>
      </div>
    </div>
  );
}, "ThreadCreator")