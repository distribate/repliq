import { SupabaseClient } from "@supabase/supabase-js"

export type RequestOptionsSupabaseClient = {
  supabase: SupabaseClient
}

export type RequestDetails = Partial<{
  ascending: boolean,
  referencedTable: string
}>