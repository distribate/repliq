import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2"

type ConnectDatabaseType = {
	database: string,
	host: string,
	password: string,
	user: string
}

async function connectDatabase(credentials: ConnectDatabaseType) {
	const connection = await mysql.createPool({
		...credentials,
		waitForConnections: true,
		connectionLimit: 16,
		maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
		idleTimeout: 120000, // idle connections timeout, in milliseconds, the default value 60000
		queueLimit: 0,
		enableKeepAlive: true,
		keepAliveInitialDelay: 0,
	})

	return drizzle(connection);
}

export const createDBInstance = async (
	database: string
) => {
	const MYSQL_PASSWORD = Deno.env.get("MYSQL_PASSWORD");
	const MYSQL_HOST = Deno.env.get("MYSQL_HOST");
	const MYSQL_USER = Deno.env.get("MYSQL_USER");

	if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD) return {
		error: "some env variables don't correct or null."
	}

	return await connectDatabase({
		database: database,
		password: MYSQL_PASSWORD,
		host: MYSQL_HOST,
		user: MYSQL_USER
	});
}