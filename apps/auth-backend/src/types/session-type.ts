import type { Insertable, Selectable } from "kysely";
import type { DB, Users } from "@repo/types/db/forum-database-types.ts";

export type Session = Insertable<Pick<DB, "users_session">["users_session"]>;
export type User = Selectable<Pick<Users, "id" | "nickname">>;