import { mysqlTable, varchar, text } from 'npm:drizzle-orm/mysql-core';

export const LANDS_PLAYERS = mysqlTable("lands_players", {
	uuid: varchar('uuid', {
		length: 50
	}).primaryKey(),
	lands: text("lands"),
	vs: text("vs"),
	flags: text("flags")
})