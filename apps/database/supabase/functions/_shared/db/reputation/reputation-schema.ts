import { mysqlTable, varchar, tinyint, bigint } from 'npm:drizzle-orm/mysql-core';

export const REPUTATION = mysqlTable("reputation", {
	uuid: varchar('uuid', {
		length: 50
	}),
	reputation: bigint("reputation", {
		length: 50,
		mode: 'number',
		unsigned: true
	}),
	acceptReputation: tinyint("acceptReputation", {
		length: 1
	})
})