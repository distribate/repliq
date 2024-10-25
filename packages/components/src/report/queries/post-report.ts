"use server"

import { ReportEntity } from "@repo/types/entities/entities-type"
import { validateRequest } from "@repo/lib/utils/auth/validate-requests.ts";
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type PostReportType = Omit<ReportEntity, "id"
	| "created_at" | "user_nickname" | "reported_item"
> & PostReportItem

export type PostReportItem = {
	target_id: string,
	target_nickname: string,
	target_content: string
}

export async function postReport({
	target_id, target_nickname, target_content,
	reason, target_user_nickname, report_type
}: PostReportType) {
	const { user } = await validateRequest();
	if (!user) return;
	
	let reported_item: PostReportItem | null = null;
	
	if (!target_nickname || !target_content || !target_id) return;
	
	reported_item = {
		target_id: target_id,
		target_content: target_content,
		target_nickname: target_nickname
	}
	
	const api = createClient();
	
	const { data, error } = await api
	.from("reports")
	.insert({
		reason,
		reported_item,
		target_user_nickname,
		report_type,
		user_nickname: user.nickname
	})
	.select()
	.returns<ReportEntity>()
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data;
}