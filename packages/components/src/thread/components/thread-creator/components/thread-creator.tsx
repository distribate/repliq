import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadModel } from "#thread/queries/get-thread-model.ts";
import { createClient } from '@repo/lib/utils/api/supabase-client.ts';

type ThreadCreatorProps = Pick<ThreadModel, "owner">;

async function getThreadCreatorThreadsCount(nickname: string) {
  const api = createClient();

  const { count, error } = await api
    .from("threads_users")
    .select("*", { count: "exact" })
    .eq("user_nickname", nickname);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 1;
}

export const ThreadCreator = async ({ owner }: ThreadCreatorProps) => {
  const threadsCount = await getThreadCreatorThreadsCount(owner.nickname);

  return (
    <div className="flex items-center gap-2 w-full">
      <Link href={USER_URL + owner.nickname}>
        <Avatar nickname={owner.nickname} propWidth={36} propHeight={36} />
      </Link>
      <div className="flex flex-col w-fit">
        <Link href={USER_URL + owner.nickname}>
          <UserNickname nickname={owner.nickname} />
        </Link>
        <Typography textSize="small" textColor="gray">
          {threadsCount}&nbsp;
          {threadsCount >= 2 ? "треда" : "тред"}
        </Typography>
      </div>
    </div>
  );
};
