"use server";

import "server-only";
import { getRequestedUser } from "@repo/lib/queries/get-requested-user.ts";
import { getFavoriteItem } from "@repo/lib/queries/get-favorite-item.ts";
import { UserCardQuery } from "./user-main-card-query.ts";
import { getUserTimeFromServer } from "@repo/lib/queries/get-user-time-from-server.ts";
import { createClient } from "@repo/shared/api/supabase-client.ts";
import { UserEntity } from '@repo/types/entities/entities-type.ts';

async function getFriendsCount({ nickname }: Pick<UserEntity, "nickname">): Promise<number> {
  const api = createClient();

  const { count, error } = await api
    .from("users_friends")
    .select("*", { count: "exact" })
    .or(`user_1.eq.${nickname},user_2.eq.${nickname}`);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

async function getThreadsCount({ nickname }: Pick<UserEntity, "nickname">): Promise<number> {
  const api = createClient();

  const { count, error } = await api
    .from("threads_users")
    .select("*", { count: "exact" })
    .eq("user_nickname", nickname);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

async function getStats({ nickname }: Pick<UserEntity, "nickname">): Promise<Pick<UserCardQuery, "stats">["stats"]> {
  const [threadsCount, friendsCount, joined] = await Promise.all([
    getThreadsCount({ nickname }),
    getFriendsCount({ nickname }),
    getUserTimeFromServer(nickname),
  ]);

  return { friendsCount, threadsCount, joined };
}

export async function getUserMainInformation({ nickname }: Pick<UserEntity, "nickname">): Promise<UserCardQuery | null> {
  const [user, stats] = await Promise.all([
    getRequestedUser(nickname),
    getStats({ nickname }),
  ]);

  if (!user) return null;

  const { favorite_item } = user;
  
  const item = await getFavoriteItem({ favorite_item });

  return {
    user,
    favoriteItem: item,
    stats: { ...stats },
  };
}