export async function getGeneralStats<T>({
	nickname, database, table, uuid
}: {
	nickname?: string,
	database: "cmi" | "new_lands" | "reputation" | "points",
	table: string,
 	uuid?: string,
}): Promise<T> {
	const res = await fetch("http://127.0.0.1:54321/functions/v1/mysql_wrapper", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU`
		},
		body: JSON.stringify({
			"nickname": nickname,
			"database": database,
			"table_name": table,
			"uuid": uuid
		})
	})
	
	return res.json();
}