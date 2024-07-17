"use server"

import { REPORT } from "@repo/types/entities/entities-type"
import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { validateRequest } from "@repo/lib/utils/auth/validate-requests.ts";

type PostReportType = Omit<REPORT, "id"
		| "created_at"
		| "user_nickname"
		| "reported_item"
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
	const supabase = createClient();
	
	let reported_item: PostReportItem | null = null;
	
	if (!target_nickname || !target_content || !target_id) return;
	
	reported_item = {
		target_id: target_id,
		target_content: target_content,
		target_nickname: target_nickname
	}
	
	const { user } = await validateRequest();
	
	if (!user) return;
	
	const { data, error: e } = await supabase
	.from("reports")
	.insert({
		reason,
		reported_item,
		target_user_nickname,
		report_type,
		user_nickname: user.nickname
	})
	.select()
	.returns<REPORT>()
	
	if (e) {
		console.error(e.message)
		throw new Error(e.message)
	}
	
	return data;
}