"use server"

import { StatsRequest } from "../../../types/stats-types.ts";
import { edgeWrapperRPC } from "@repo/lib/edge-functions/edge-wrapper.ts";
import { ReputationResponse } from "@repo/types/db/reputation.ts"
import { PointsResponse } from "@repo/types/db/points.ts"
import { CMIResponse } from "@repo/types/db/cmi-response.ts"

async function getCMIUsersData({
	nickname, uuid
}: StatsRequest) {
	return edgeWrapperRPC<CMIResponse>({
		database: "cmi", table: "cmi_users", nickname: nickname, uuid: uuid
	});
}

async function getCMIUserStats({
	uuid, nickname
}: StatsRequest) {
	const { data, error } = await getCMIUsersData({
		nickname, uuid
	})
	
	if (error) return null;
	
	return data;
}


async function getPointsData({
	nickname, uuid
}: StatsRequest) {
	return edgeWrapperRPC<PointsResponse>({
		database: "playerpoints", table: " ", nickname: nickname, uuid: uuid
	})
}

async function getPointsUserStats({
	nickname, uuid
}: StatsRequest) {
	const { data, error } = await getPointsData({
		nickname, uuid
	})
	
	if (error) return null
	
	return data;
}


async function getReputationData({
	nickname, uuid
}: StatsRequest) {
	return edgeWrapperRPC<ReputationResponse>({
		database: "reputation", table: " ", nickname: nickname, uuid: uuid
	});
}

async function getReputationUserStats({
	nickname, uuid
}: StatsRequest) {
	const { data, error } = await getReputationData({
		nickname, uuid
	})
	
	if (error) return null;
	
	return data;
}


export async function getAllGeneralStats({
	nickname, uuid
}: StatsRequest) {
	const [ cmi, rep, points ] = await Promise.all([
		getCMIUserStats({
			nickname, uuid
		}),
		getReputationUserStats({
			nickname, uuid
		}),
		getPointsUserStats({
			nickname, uuid
		})
	])
	
	return { cmi, rep, points }
}

export { getCMIUsersData, getReputationData, getPointsData }