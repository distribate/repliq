import { relations } from "drizzle-orm/relations";
import { events, eventsPlayers } from "./schema";

export const eventsPlayersRelations = relations(eventsPlayers, ({one}) => ({
	event: one(events, {
		fields: [eventsPlayers.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	eventsPlayers: many(eventsPlayers),
}));