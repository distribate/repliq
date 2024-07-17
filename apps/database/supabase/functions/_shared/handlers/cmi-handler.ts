import { CMI_USERS } from "../db/cmi/cmi-users-schema.ts";
import { eq } from "drizzle-orm";
import { formatToMs } from "../utils/convert-time.ts";
import { createResponse } from "../helpers/response-handler.ts";

type CMITables = "cmi_users" | "cmi_playtime";

export type CMIResponseType = typeof CMI_USERS.$inferSelect;

interface CMIHandler {
	db: any;
	table: CMITables;
	nickname: string | undefined;
}

export async function handleCMI({
	db,
	nickname,
	table,
}: CMIHandler): Promise<Response> {
	if (table !== "cmi_users") {
		return createResponse({
			status: 404,
			statusText: "Table not found",
			body: { error: "Table not found in 'cmi' db" },
		});
	}

	if (!nickname) {
		return createResponse({
			status: 404,
			statusText: "Missing nickname parameter in body",
		});
	}

	const response: CMIResponseType[] = await db
		.select()
		.from(CMI_USERS)
		.where(eq(CMI_USERS.username, nickname));

	if (response && response.length > 0) {
		const playtimeConverted = formatToMs(
			response[0].totalplaytime
		);
		
		const userRes = {
			...response[0], totalplaytime: playtimeConverted
		};

		return createResponse({ status: 200, body: userRes });
	} else {
		return createResponse({
			status: 204,
			statusText: "No data found in 'cmi' db",
		});
	}
}
