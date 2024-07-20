import { Tables } from '@repo/types/entities/supabase.ts';

export type BanUser = {
  type: "ban" | "unban",
  nickname: string,
  parameters?: Partial<Omit<Tables<"users_banned">, "id"
    | "created_at"
    | "nickname">
  >
}