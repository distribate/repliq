import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import postgres from "postgres";

const connectionString = process.env.CONNECTION_STRING!;
const usersTable = "users"
const usersSessionTable = "users_session"

export const sql = postgres(connectionString, {
	max: 100,
	idle_timeout: 20,
	max_lifetime: 60 * 30
});

export const adapter = new PostgresJsAdapter(sql, {
	user: usersTable,
	session: usersSessionTable
});