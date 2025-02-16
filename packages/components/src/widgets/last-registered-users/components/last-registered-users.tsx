import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserPreviewCard } from "#cards/components/user-preview-card/user-preview-card.tsx";
import { forumLandingClient } from "@repo/shared/api/forum-client.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { decode } from "cbor-x"
import { Skeleton } from "@repo/ui/src/components/skeleton";

export const getLastUsers = async (limit?: number) => {
  const url = forumLandingClient["get-latest-reg-users"].$url({
    query: {
      limit: limit ? `${limit}` : undefined
    }
  })

  const res = await ky.get(url, {
    credentials: "include",
  })

  const encodedData = await res.arrayBuffer()

  if (!encodedData) {
    return null
  }

  const uint8Data = new Uint8Array(encodedData)

  const data: {
    id: string;
    description: string | null;
    name_color: string;
    nickname: string;
  }[] = decode(uint8Data)

  if ("error" in data) {
    return null
  }

  return data
};

const lastUsersQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["last-users"]),
  queryFn: () => getLastUsers()
})

export const LastRegisteredUsers = () => {
  const { data: lastUsers, isLoading } = lastUsersQuery();

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