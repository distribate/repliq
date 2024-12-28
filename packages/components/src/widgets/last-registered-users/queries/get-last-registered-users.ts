import {
  RequestDetails,
} from "@repo/types/entities/entities-type.ts";
import { createClient } from '@repo/shared/api/supabase-client.ts';
import { getUserBanned } from "@repo/lib/queries/get-user-banned.ts";

export async function getLastUsers(
  filter?: RequestDetails,
) {
  const api = createClient();

  let users

  let query = api
    .from("users")
    .select(
      `nickname, description, created_at, name_color, donate, favorite_item`,
    )
    .order("created_at", { ascending: false });

  if (filter?.limit) query.limit(filter.limit);
  if (filter?.range) query.range(filter.range[0], filter.range[1]);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  users = [];

  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const banStatus = await getUserBanned(user.nickname);

    if (!banStatus || banStatus.nickname !== user.nickname) {
      users.push(user);
    }
  }

  return users;
}
