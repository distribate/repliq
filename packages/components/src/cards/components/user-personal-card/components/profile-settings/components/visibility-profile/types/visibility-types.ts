import { Database } from '@repo/types/entities/supabase.ts';

export type ProfileVisibilityChangeType = {
  visibility: Database["public"]["Enums"]["profile_visibility"]
}