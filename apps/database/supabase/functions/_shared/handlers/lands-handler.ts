import { LANDS_LANDS } from "../db/lands/lands-lands-schema.ts";
import { createResponse } from "../helpers/response-handler.ts";
import { CMI_USERS } from "../db/cmi/cmi-users-schema.ts";
import { eq } from "npm:drizzle-orm";
import { createDBInstance } from "../utils/connect-database.ts";

type LandsTables = "lands_lands" | "lands_players";

interface LandsHandler {
	// deno-lint-ignore no-explicit-any
	db: any;
	table: LandsTables;
	uuid: string | undefined;
}

type MembersType = {
	nickname: string,
	uuid: string,
	chunks: number
}

export type LANDS = typeof LANDS_LANDS.$inferSelect;

async function getNicknameByUUID(uuid_array: string[]) {
	const db = await createDBInstance("cmi");
	
	const nicknames: string[] = [];
	
	for (const uuid of uuid_array) {
		const iterator = await db
		.select({
			nickname: CMI_USERS.username,
		})
		.from(CMI_USERS)
		.where(eq(CMI_USERS.player_uuid, uuid))
		.iterator();
		
		for await (const row of iterator) {
			nicknames.push(row.nickname);
		}
	}
	
	return nicknames;
}

export async function handleLands({
	table,
	uuid,
	db,
}: LandsHandler): Promise<Response> {
	if (table !== "lands_lands") {
		return createResponse({
			status: 404,
			statusText: "Table not found",
			body: {
				error: "Table not found in 'lands' db",
			},
		});
	}
	if (!uuid) {
		return createResponse({
			status: 404,
			statusText: "Missing uuid",
			body: {
				error: "Missing uuid parameter in body",
			},
		});
	}

	const response: LANDS[] = await db
		.select()
		.from(LANDS_LANDS)
		.iterator();

	let land_response;

	for await (const raw of response) {
		const parsedMembers = JSON.parse(raw.members);
		const creator = Object.keys(parsedMembers)[0];
		const area = JSON.parse(raw.area); // parse stringified json to normal form
		const membersUUIDs = Object.keys(parsedMembers);
		
		let members: MembersType[] = [];
		
		if (membersUUIDs.length) {
			const nicknames = await getNicknameByUUID(membersUUIDs);
			
			members = membersUUIDs.map((
				uuid, index
			) => ({
				uuid,
				nickname: nicknames[index],
				chunks: parsedMembers[uuid].chunks
			}));
		}
		
		if (creator === uuid) {
			land_response = {
				...raw, members: members, creator: creator, area: area
			};
			
			break;
		}
	}

	if (land_response) {
		return createResponse({ status: 200, body: land_response });
	} else {
		return createResponse({
			status: 204,
			statusText: "No data found in 'lands' table",
		});
	}
}