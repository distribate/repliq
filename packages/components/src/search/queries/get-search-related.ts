"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { getLastUsers } from "#widgets/last-registered-users/queries/get-last-registered-users.ts";
import { RequestDetails } from "@repo/types/entities/entities-type.ts";

async function getLastThreads(filter?: RequestDetails) {
  const api = createClient();

  let query = api
    .from("threads")
    .select("id, title, description")
    .order("created_at", { ascending: false });

  if (filter?.limit) query.limit(filter.limit);
  if (filter?.range) query.range(filter.range[0], filter.range[1]);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getSearchRelated(limit: number = 5) {
  const [lastUsers, lastThreads] = await Promise.all([
    getLastUsers({ limit }),
    getLastThreads({ limit }),
  ]);

  return { lastUsers, lastThreads };
}
