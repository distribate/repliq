"use server"

import { createClient } from "../utils/supabase/server.ts";
import { PostgrestSingleResponse } from "@supabase/postgrest-js";

type EdgeWrapperRPC = {
	database: string,
	table?: string,
	nickname?: string,
	uuid?: string
}

export async function edgeWrapperRPC<T>({
	uuid, nickname, table, database
}: EdgeWrapperRPC): Promise<PostgrestSingleResponse<T>> {
	const supabase = createClient();
	
	return supabase.rpc("edge_wrapper",
		{
			"database": database,
			"table_name": table,
			"nickname": nickname,
			"uuid": uuid
		}
	)
}