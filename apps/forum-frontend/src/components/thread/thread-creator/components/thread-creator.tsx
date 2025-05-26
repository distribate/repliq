import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { threadAtom } from "#components/thread/thread-main/models/thread.model";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";

export const ThreadCreator = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  if (!thread) return null;

  const { owner: { name_color, nickname } } = thread

  return (
    <div className="flex items-start gap-2 w-full">
      <CustomLink to={USER_URL + nickname}>
        <Avatar nickname={nickname} propWidth={56} propHeight={56} />
      </CustomLink>
      <div className="flex flex-col items-start w-fit gap-1">
        <CustomLink to={USER_URL + nickname}>
          <UserNickname nickname={nickname} nicknameColor={name_color ?? undefined} />
        </CustomLink>
      </div>
    </div>
  );
}, "ThreadCreator")