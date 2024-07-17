import { REPUTATION } from "../db/reputation/reputation-schema.ts";
import { eq } from "drizzle-orm";
import { createResponse } from "../helpers/response-handler.ts";

interface ReputationHandler {
	db: any;
	uuid: string | undefined;
}

export async function handleReputation({
	uuid,
	db,
}: ReputationHandler): Promise<Response> {
	if (!uuid) {
		return new Response("Missing uuid parameter in body", {
			status: 404,
		});
	}

	const response = await db
		.select()
		.from(REPUTATION)
		.where(eq(REPUTATION.uuid, uuid));

	if (response && response.length >= 1) {
		return createResponse({ status: 200, body: response[0] });
	} else {
		return createResponse({
			status: 204,
			statusText: "No data found in 'reputation' table"
		})
	}
}