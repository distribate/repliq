import { mysqlTable, char, timestamp, tinytext, float, varchar, text } from 'npm:drizzle-orm/mysql-core';

export const LANDS_LANDS = mysqlTable("lands_lands", {
	ulid: char("ulid", {
		length: 26
	}).primaryKey().notNull(),
	server: varchar("server", {
		length: 32
	}).notNull(),
	world: char("world", {
		length: 26
	}).notNull(),
	category: tinytext("category"),
	members: text("members").notNull(),
	area: text("area").notNull(),
	balance: float("balance"),
	type: tinytext("type").notNull(),
	name: varchar("name", {
		length: 80
	}).notNull(),
	created_at: timestamp("created_at").notNull(),
	title: varchar("title", {
		length: 300
	}).notNull()
})