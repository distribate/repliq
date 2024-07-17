import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import postgres from "postgres";

const connectionString = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

export const sql = postgres(connectionString, {
	max: 100,
	idle_timeout: 20,
	max_lifetime: 60 * 30
});

export const adapter = new PostgresJsAdapter(sql, {
	user: "users",
	session: "users_session"
});