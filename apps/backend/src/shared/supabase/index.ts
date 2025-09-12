import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "../env";

let supabase: SupabaseClient

async function getBucketsList() {
  const { data: buckets, error } = await supabase.storage.listBuckets()

  if (error) {
    throw new Error(error.message)
  }

  console.log("\x1B[35m[Supabase]\x1B[0m Storage buckets:", buckets.map(bucket => bucket.name).join(", "))
}

function initSupabase() {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  console.log("\x1B[35m[Supabase]\x1B[0m Created")
}

export async function startSupabase() {
  initSupabase()
  await getBucketsList()
  console.log("\x1B[35m[Supabase]\x1B[0m Started")
}

export function getSupabaseClient() {
  if (!supabase) throw new Error()
  return supabase
}