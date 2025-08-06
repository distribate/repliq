import type { Insertable } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types.ts";

export type Session = Insertable<Pick<DB, "users_session">["users_session"]>;