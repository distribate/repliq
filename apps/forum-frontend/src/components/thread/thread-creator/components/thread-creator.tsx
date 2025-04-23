import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/components/nickname";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "#components/thread/thread-main/queries/thread-query";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Suspense } from "react";

type ThreadCreatorProps = {
  threadId: string
}

export const ThreadCreator = ({ threadId }: ThreadCreatorProps) => {
  const qc = useQueryClient()

  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));

  if (!thread) return null;

  const { owner: { name_color, nickname } } = thread

  return (
    <div className="flex items-start gap-2 w-full">
      <Suspense fallback={<Skeleton className="w-[56px] h-[56px]" />}>
        <Link to={USER_URL + nickname}>
          <Avatar nickname={nickname} propWidth={56} propHeight={56} />
        </Link>
      </Suspense>
      <div className="flex flex-col items-start w-fit gap-1">
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname} nicknameColor={name_color ?? undefined} />
        </Link>
      </div>
    </div>
  );
};