import { originList } from "@repo/shared/constants/origin-list.ts";

export const corsOptions = {
  origin: originList,
  credentials: true,
  maxAge: 86400
}