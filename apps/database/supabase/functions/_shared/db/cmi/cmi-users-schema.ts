import { mysqlTable, bigint, double, serial, text } from 'npm:drizzle-orm/mysql-core';
import { createSelectSchema } from 'npm:drizzle-zod';

const CMI_TABLES = ["cmi_users", "cmi_playtime"];

export const CMI_USERS = mysqlTable(CMI_TABLES[0], {
	id: serial('id').primaryKey(),
	username: text('username').notNull(),
	balance: double("Balance"),
	totalplaytime: bigint("TotalPlayTime", {
		mode: 'number',
		unsigned: true
	}),
	player_uuid: text("player_uuid"),
	usermeta: text("UserMeta"),
	displayname: text("DisplayName")
});

export const CMIRes = createSelectSchema(CMI_USERS);