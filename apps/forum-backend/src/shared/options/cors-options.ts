import { originList } from "./origin-list";

export const corsOptions = {
  origin: originList,
  credentials: true,
  maxAge: 86400
}