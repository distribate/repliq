"use server"

import { StatsRequest } from "../../../types/stats-types.ts";
import { edgeWrapperRPC } from "@repo/lib/edge-functions/edge-wrapper.ts";
import { LandsResponse } from "@repo/types/db/lands.ts"

async function getLandsData({
	nickname, uuid
}: StatsRequest) {
	return edgeWrapperRPC<LandsResponse>({
		database: "new_lands", table: "lands_lands", nickname: nickname, uuid: uuid
	});
}

export async function getLandsStats({
	nickname, uuid
}: StatsRequest) {
	const { data, error } = await getLandsData({
		nickname, uuid
	})
	
	if (error) {
		return null;
	}
	
	return data;
}