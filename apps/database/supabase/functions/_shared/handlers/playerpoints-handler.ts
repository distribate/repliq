import { createResponse } from "../helpers/response-handler.ts";
import { PLAYERPOINTS_POINTS } from "../db/playerpoints/playerpoints-points-schema.ts";
import { eq } from "drizzle-orm";

interface PlayerPointsHandler {
	db: any;
	uuid?: string;
}

type PLAYERPOINTS = typeof PLAYERPOINTS_POINTS.$inferSelect;

export async function handlePoints({
	db,
	uuid,
}: PlayerPointsHandler): Promise<Response> {
	if (!uuid) {
		return createResponse({
			status: 404,
			statusText: "Missing uuid parameter in body",
		});
	}
	
	const response: PLAYERPOINTS[] = await db
		.select()
		.from(PLAYERPOINTS_POINTS)
		.where(eq(PLAYERPOINTS_POINTS.uuid, uuid))
	
	if (response && response.length > 0) {
		return createResponse({
			status: 200,
			body: response[0]
		})
	} else {
		return createResponse({
			status: 204,
			statusText: "No data found in 'playerpoints' db"
		})
	}
}