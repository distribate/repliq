import { createClient } from "@supabase/supabase-js";

const URL = Bun.env.SUPABASE_URL;
const ROLE_KEY = Bun.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(URL, ROLE_KEY);

export async function initSupabase() {
  const { data: buckets, error } = await supabase.storage.listBuckets()

  if (error) {
    throw new Error(error.message)
  }

  console.log("\x1B[35m[Supabase]\x1B[0m Storage buckets:", buckets.map(bucket => bucket.name).join(", "))
  
  console.log("\x1B[35m[Supabase]\x1B[0m Started")
}