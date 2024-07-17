import {
	int,
	mysqlTable,
	serial,
	varchar,
} from "npm:drizzle-orm/mysql-core";
import { createSelectSchema } from 'npm:drizzle-zod';

export const PLAYERPOINTS_POINTS = mysqlTable("playerpoints_points", {
	id: serial("id").primaryKey().notNull(),
	uuid: varchar("uuid", { length: 36 }).primaryKey().notNull(),
	points: int("points").notNull()
});

export const PLAYERPOINTSRes = createSelectSchema(PLAYERPOINTS_POINTS);