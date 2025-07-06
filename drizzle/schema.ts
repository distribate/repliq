import { sqliteTable, AnySQLiteColumn, integer, text, foreignKey, numeric } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const alerts = sqliteTable("alerts", {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	creator: text().notNull(),
	description: text(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const minecraftNews = sqliteTable("minecraft_news", {
	id: integer().primaryKey(),
	title: text().notNull(),
	description: text().notNull(),
	mediaLinks: text("media_links"),
	tags: text(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	imageUrl: text().notNull(),
});

export const events = sqliteTable("events", {
	id: integer().primaryKey(),
	title: text().notNull(),
	description: text(),
	reward: text().notNull(),
	origin: text().notNull(),
	imageUrl: text(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const eventsPlayers = sqliteTable("events_players", {
	id: integer().primaryKey(),
	eventId: integer("event_id").notNull().references(() => events.id),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	nickname: text().notNull(),
	status: text().notNull(),
});

export const votedUsers = sqliteTable("voted_users", {
	id: integer().primaryKey(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	nickname: text().notNull(),
});

export const advertisement = sqliteTable("advertisement", {
	id: integer().primaryKey(),
	title: text().notNull(),
	description: text().notNull(),
	embedded: text(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	owner: text().notNull(),
	link: text(),
});

export const ipList = sqliteTable("ip_list", {
	id: integer().primaryKey(),
	name: text().notNull(),
	ip: text().notNull(),
});

export const currencies = sqliteTable("currencies", {
	id: integer().primaryKey(),
	title: text().notNull(),
	imageUrl: text().notNull(),
	value: text(),
	isPublic: numeric().default(sql`(TRUE)`).notNull(),
	isAvailable: numeric().default(sql`(TRUE)`).notNull(),
});

export const mediaLinks = sqliteTable("media_links", {
	id: integer().primaryKey(),
	value: text().notNull(),
	link: text().notNull(),
});

export const minecraftItems = sqliteTable("minecraft_items", {
	id: integer().primaryKey(),
	title: text().notNull(),
	description: text(),
	image: text().notNull(),
});

export const minecraftFacts = sqliteTable("minecraft_facts", {
	id: integer().primaryKey(),
	fact: text().notNull(),
});

export const modpack = sqliteTable("modpack", {
	id: integer().primaryKey(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	name: text().notNull(),
	client: text().notNull(),
	version: text().notNull(),
	mods: text().notNull(),
	imageUrl: text().notNull(),
	downloadLink: text().notNull(),
	shaders: text(),
});

export const rulesRuleContent = sqliteTable("rules_rule_content", {
	id: integer().primaryKey(),
	ruleListId: text("rule_list_id").notNull(),
	title: text().notNull(),
	punishment: text(),
	description: text(),
	subtitle: text(),
});

export const rulesTerminContent = sqliteTable("rules_termin_content", {
	id: integer().primaryKey(),
	articleTitle: text("article_title").notNull(),
	articleDesc: text("article_desc").notNull(),
});

export const errorsLogs = sqliteTable("errors_logs", {
	id: integer().primaryKey(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	type: text().notNull(),
	description: text().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
});

