import { createClient } from "#utils/api/supabase-client.ts";
import { AlertEntity } from "@repo/types/entities/entities-type.ts"

type GetAlerts = {
  sort?: "created_at",
  range?: number[],
  limit?: number
}

export async function getAlerts(filter?: GetAlerts) {
  const api = createClient();
  
  let query = api
  .from("config_alerts")
  .select()
  .returns<AlertEntity[]>()
  
  if (filter?.sort) query.order(filter.sort, { ascending: false })
  if (filter?.limit) query.limit(filter.limit)
  if (filter?.range) query.range(filter.range[0], filter.range[1])
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}