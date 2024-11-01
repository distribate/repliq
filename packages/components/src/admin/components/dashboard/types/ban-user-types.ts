import { BanEntity } from '@repo/types/entities/entities-type.ts';

export type BanUser = {
  type: "ban" | "unban",
  nickname: string,
  parameters?: Partial<Omit<BanEntity, "id"
    | "created_at"
    | "nickname">
  >
}