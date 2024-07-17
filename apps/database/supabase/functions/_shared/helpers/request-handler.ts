import { createDBInstance } from "../utils/connect-database.ts";
import { handleLands } from "../handlers/lands-handler.ts";
import { handleReputation } from "../handlers/reputation-handler.ts";
import { handleCMI } from "../handlers/cmi-handler.ts";
import { createResponse } from "./response-handler.ts";
import { handlePoints } from "../handlers/playerpoints-handler.ts";

export type Database = "cmi" | "new_lands" | "reputation" | "playerpoints";

export async function handleRequest(
	requestBody: any,
): Promise<Response> {
	const database: Database = requestBody.database;
	const table = requestBody.table_name;
	const nickname: string | undefined = requestBody.nickname;
	const uuid: string | undefined = requestBody.uuid;

	if (!database || !table) {
		return createResponse({
			statusText: "Missing db",
			status: 401,
			body: {
				error: "Missing db or table",
			},
		});
	}

	const db = await createDBInstance(database);

	switch (database) {
		case "cmi":
			return handleCMI({
				table: table,
				nickname: nickname,
				db: db,
			});
		case "new_lands":
			return handleLands({
				uuid: uuid,
				db: db,
				table: table,
			});
		case "reputation":
			return handleReputation({
				uuid: uuid,
				db: db,
			});
		case "playerpoints":
			return handlePoints({
				uuid: uuid,
				db: db
			})
		default:
			return createResponse({
				status: 401,
				statusText: "Invalid db",
				body: {
					error: "Invalid db specified",
				},
			});
	}
}