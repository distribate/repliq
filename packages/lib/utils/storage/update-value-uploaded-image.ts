"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";

type UpdateProperties = {
	table: string,
	field: {
		[key: string]: string
	},
	equals: {
		column: string,
		value: unknown
	}
}

export async function updateValueOfUploadedImage({
	table, field, equals
}: UpdateProperties): Promise<boolean> {
	const supabase = createClient()
	
	const { error, status, statusText, count } = await supabase
	.from(table)
	.update(field)
	.eq(equals.column, equals.value)
	
	return !(error || status === 404);
}