"use client"

import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserPreviewCard } from "#cards/components/user-preview-card/user-preview-card.tsx";
import { forumLandingClient } from "@repo/shared/api/forum-client.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@repo/lib/helpers/get-user";

const getLastUsers = async () => {
  const res = await forumLandingClient["get-latest-reg-users"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
};

const lastUsersQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["last-users"]),
  queryFn: getLastUsers,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: 1000 * 60 * 5
})

export const LastRegisteredUsers = () => {
  const { data: lastUsers } = lastUsersQuery();

  if (!lastUsers) return null;

  return (
    <div className="flex flex-col gap-4 border border-shark-800 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Новые пользователи
      </Typography>
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2 w-full">
        {lastUsers.map(user => <UserPreviewCard key={user.nickname} {...user} />)}
      </div>
    </div>
  );
};