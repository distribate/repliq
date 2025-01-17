import { originList } from "./origin-list";

export const corsOptions = {
  origin: originList,
  credentials: true,
  maxAge: 86400,
  allowHeaders: ["Cookie", "cookie", "x-csrf-token", "X-CSRF-Token", "content-type", "Content-Type"]
}