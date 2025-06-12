import { pgTable, serial, text, uuid, timestamp, jsonb, bigint, uniqueIndex, foreignKey, index, boolean, check, unique, date, varchar, primaryKey, pgSequence, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const commentsParentType = pgEnum("comments_parent_type", ['thread', 'post'])
export const donateVariants = pgEnum("donate_variants", ['default', 'authentic', 'helper', 'loyal', 'arkhont', 'dev', 'moder'])
export const issueType = pgEnum("issue_type", ['bug', 'suggestion', 'game'])
export const postVisibility = pgEnum("post_visibility", ['all', 'only', 'friends'])
export const profileVisibility = pgEnum("profile_visibility", ['all', 'friends'])
export const reportReason = pgEnum("report_reason", ['spam', 'offensive', 'dont-like'])
export const reportType = pgEnum("report_type", ['comment', 'post', 'thread', 'account'])
export const requestTimeoutType = pgEnum("request_timeout_type", ['description', 'favorite_item', 'real_name', 'name_color'])
export const threadRatingType = pgEnum("thread_rating_type", ['decrement', 'increment'])
export const userAccountStatus = pgEnum("user_account_status", ['deleted', 'archived'])

export const adminsIdSeq1 = pgSequence("admins_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const categoryIdSeq1 = pgSequence("category_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const configAlertsIdSeq1 = pgSequence("config_alerts_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const configMinecraftItemsIdSeq1 = pgSequence("config_minecraft_items_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const infoFindoutIdSeq = pgSequence("info_findout_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const reportsIdSeq1 = pgSequence("reports_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const threadsImagesIdSeq1 = pgSequence("threads_images_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const threadsRatingIdSeq1 = pgSequence("threads_rating_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const threadsTagsIdSeq1 = pgSequence("threads_tags_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const usersBannedIdSeq1 = pgSequence("users_banned_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const usersBlockedIdSeq1 = pgSequence("users_blocked_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const rulesRuleContent = pgTable("rules_rule_content", {
	id: serial().primaryKey().notNull(),
	ruleListId: text("rule_list_id"),
	title: text().notNull(),
	punishment: text(),
	description: text(),
	subtitle: text(),
});

export const news = pgTable("news", {
	id: uuid().default(sql`uuid_generate_v1()`).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	mediaLinks: jsonb("media_links"),
	tags: text().array(),
	imageUrl: text().default('\'/news/art-bzzvanet.jpg').notNull(),
});

export const rulesTerminContent = pgTable("rules_termin_content", {
	id: serial().primaryKey().notNull(),
	articleTitle: text("article_title").notNull(),
	articleDesc: text("article_desc").notNull(),
});

export const events = pgTable("events", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "events_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	description: text(),
	imageUrl: text(),
	reward: text().notNull(),
	origin: text().notNull(),
});

export const usersGameStatus = pgTable("users_game_status", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_game_status_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	nickname: text().notNull(),
	status: text().notNull(),
	joined: timestamp({ withTimezone: true, mode: 'string' }),
	quited: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("users_game_status_nickname_idx").using("btree", table.nickname.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_game_status_nickname_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const usersSettings = pgTable("users_settings", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_settings_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: uuid("user_id").notNull(),
	coverOutlineVisible: boolean("cover_outline_visible").default(true).notNull(),
	acceptFriendRequest: boolean("accept_friend_request").default(true).notNull(),
	realNameVisible: boolean("real_name_visible").default(true).notNull(),
	gameStatsVisible: boolean("game_stats_visible").default(true).notNull(),
	profileVisibility: profileVisibility("profile_visibility").default('all').notNull(),
	nickname: text().notNull(),
	sendNotifications: boolean("send_notifications").default(true).notNull(),
	showGameLocation: boolean("show_game_location").default(true).notNull(),
}, (table) => [
	index("idx_users_settings_nickname").using("btree", table.nickname.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_settings_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "users_settings_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usersActions = pgTable("users_actions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_actions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	sourceNickname: text("source_nickname").notNull(),
	targetNickname: text("target_nickname").notNull(),
	type: text().notNull(),
	uuid: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "notifications_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	nickname: text().notNull(),
	message: text().notNull(),
	read: boolean().default(false).notNull(),
	type: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "notifications_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const votedUsers = pgTable("voted_users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "voted_users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	nickname: text().notNull(),
});

export const usersStatus = pgTable("users_status", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_status_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	nickname: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_status_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const minecraftProfiles = pgTable("minecraft_profiles", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	nickname: text().notNull(),
	uuid: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	profileId: bigint("profile_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [usersProfiles.id],
			name: "minecraft_profiles_profile_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const permissions = pgTable("permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "permissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	donate: donateVariants().notNull(),
	permission: text().notNull(),
});

export const refferals = pgTable("refferals", {
	id: uuid().defaultRandom().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
	completed: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.initiator],
			foreignColumns: [users.nickname],
			name: "refferals_initiator_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [users.nickname],
			name: "refferals_recipient_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const issuesApprovals = pgTable("issues_approvals", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "issues_approvals_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	responser: text().default('DEFAULT'),
	message: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	issueId: bigint("issue_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.issueId],
			foreignColumns: [issues.id],
			name: "issues_approvals_issue_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.responser],
			foreignColumns: [users.nickname],
			name: "issues_approvals_responser_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const usersMain = pgTable("users_main", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_main_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	hash: text().notNull(),
});

export const reportsApprovals = pgTable("reports_approvals", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "report_approvals_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reportId: bigint("report_id", { mode: "number" }).notNull(),
	status: text().notNull(),
	message: text(),
}, (table) => [
	foreignKey({
			columns: [table.reportId],
			foreignColumns: [reports.id],
			name: "report_approvals_report_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usersPunish = pgTable("users_punish", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_punish_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	nickname: text().notNull(),
	type: text().notNull(),
	initiator: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_punish_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_punish_nickname_fkey1"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const modpack = pgTable("modpack", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "landing_modpack_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text(),
	client: text(),
	version: text(),
	mods: text().array(),
	imageUrl: text().default('/modpacks/art-bzzvanet.jpg').notNull(),
	downloadLink: text(),
	shaders: text().array(),
});

export const currencies = pgTable("currencies", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "landing_currencies_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	imageUrl: text().notNull(),
	value: text().notNull(),
	isAvailable: boolean().default(true).notNull(),
	public: boolean().default(true).notNull(),
});

export const errorsLog = pgTable("errors_log", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "errors_log_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	type: text().notNull(),
	description: text().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
});

export const ipList = pgTable("ip_list", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "ip_list_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: text().notNull(),
	ip: text().notNull(),
});

export const eventsPlayers = pgTable("events_players", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "events_accepted_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	eventId: bigint("event_id", { mode: "number" }).notNull(),
	nickname: text().notNull(),
	status: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "events_accepted_event_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const usersProfiles = pgTable("users_profiles", {
	userId: uuid("user_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_profiles_idd_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	type: text().default('').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "users_profiles_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const issues = pgTable("issues", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userNickname: text("user_nickname").notNull(),
	title: text().notNull(),
	description: text().notNull(),
	type: issueType().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "issues_asd_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
}, (table) => [
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "issues_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const usersCredentials = pgTable("users_credentials", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "users_credentials_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	hash: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "users_credentials_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const links = pgTable("links", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "links_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	value: text().notNull(),
	link: text().notNull(),
});

export const comments = pgTable("comments", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "comments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	parentId: uuid("parent_id").notNull(),
	parentType: commentsParentType("parent_type").notNull(),
	content: text().notNull(),
	userNickname: text("user_nickname").notNull(),
	isUpdated: boolean("is_updated").default(false).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "comments_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const commentsReplies = pgTable("comments_replies", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "comments_replies_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	initiatorCommentId: bigint("initiator_comment_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	recipientCommentId: bigint("recipient_comment_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.initiatorCommentId],
			foreignColumns: [comments.id],
			name: "comments_replies_initiator_comment_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipientCommentId],
			foreignColumns: [comments.id],
			name: "comments_replies_recipient_comment_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const admins = pgTable("admins", {
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "admins_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	telegramId: bigint("telegram_id", { mode: "number" }),
	nickname: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "admins_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "admins_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const category = pgTable("category", {
	available: boolean().default(true).notNull(),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "category_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	title: text().notNull(),
	emoji: text().notNull(),
	color: text().notNull(),
});

export const configAdvertisement = pgTable("config_advertisement", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	description: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	link: text(),
	owner: text().notNull(),
	title: text().notNull(),
});

export const configAlerts = pgTable("config_alerts", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "config_alerts_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	link: text(),
	title: text().notNull(),
	creator: text().notNull(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.creator],
			foreignColumns: [users.nickname],
			name: "config_alerts_creator_fkey"
		}).onUpdate("cascade"),
	check("config_alerts_description_check", sql`length(description) < 256`),
	check("config_alerts_title_check", sql`length(title) < 100`),
]);

export const configMinecraftFacts = pgTable("config_minecraft_facts", {
	fact: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
});

export const configMinecraftItems = pgTable("config_minecraft_items", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "config_minecraft_items_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	image: text().notNull(),
	title: text().notNull(),
	description: text(),
});

export const friendsNotes = pgTable("friends_notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
	note: text().notNull(),
	friendId: uuid("friend_id").notNull(),
}, (table) => [
	uniqueIndex("friends_notes_unique_idx").using("btree", table.friendId.asc().nullsLast().op("text_ops"), table.initiator.asc().nullsLast().op("uuid_ops"), table.recipient.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.friendId],
			foreignColumns: [usersFriends.id],
			name: "friends_notes_friend_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.initiator],
			foreignColumns: [users.nickname],
			name: "friends_notes_initiator_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [users.nickname],
			name: "friends_notes_recipient_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	check("friends_notes_note_check", sql`length(note) < 32`),
]);

export const friendsPinned = pgTable("friends_pinned", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
	friendId: uuid("friend_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.friendId],
			foreignColumns: [usersFriends.id],
			name: "friends_pinned_friend_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.initiator],
			foreignColumns: [users.nickname],
			name: "friends_pinned_initiator_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [users.nickname],
			name: "friends_pinned_recipient_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const infoFindout = pgTable("info_findout", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "info_findout_id_seq1", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	findout: text().notNull(),
	userNickname: text("user_nickname").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "info_findout_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const friendsRequests = pgTable("friends_requests", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	uniqueIndex("unique_recipient_initiator_pair").using("btree", sql`LEAST(recipient, initiator)`, sql`GREATEST(recipient, initiator)`),
	foreignKey({
			columns: [table.initiator],
			foreignColumns: [users.nickname],
			name: "friends_requests_initiator_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [users.nickname],
			name: "friends_requests_recipient_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const postsViews = pgTable("posts_views", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "posts_views_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	postId: uuid("post_id").notNull(),
	nickname: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "posts_views_nickname_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "posts_views_post_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("posts_views_post_user_unique").on(table.postId, table.nickname),
]);

export const moderators = pgTable("moderators", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "moderators_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "moderators_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const posts = pgTable("posts", {
	isComments: boolean().default(true).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	visibility: postVisibility().default('all').notNull(),
	isUpdated: boolean().default(false).notNull(),
	isPinned: boolean().default(false).notNull(),
});

export const postsComments = pgTable("posts_comments", {
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userNickname: text("user_nickname").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "posts_comments_id_seq1", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	postId: uuid("post_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "p_comments_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "posts_comments_post_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const profileViews = pgTable("profile_views", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "profile_views_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	initiator: text().notNull(),
	recipient: text().notNull(),
	resolved: boolean().default(false).notNull(),
	response: text().default('NULL'),
}, (table) => [
	index("idx_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_recipient").using("btree", table.recipient.asc().nullsLast().op("text_ops")),
	index("profile_views_initiator_recipient_idx").using("btree", table.initiator.asc().nullsLast().op("text_ops"), table.recipient.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
	index("profile_views_recipient_initiator_idx").using("btree", table.recipient.asc().nullsLast().op("timestamptz_ops"), table.initiator.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("text_ops")),
	foreignKey({
			columns: [table.initiator],
			foreignColumns: [users.nickname],
			name: "profile_views_initiator_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [users.nickname],
			name: "profile_views_recipient_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const status = pgTable("status", {
	userId: text("user_id").primaryKey().notNull(),
	value: boolean().default(true).notNull(),
});

export const reports = pgTable("reports", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "reports_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	reason: reportReason().default('spam').notNull(),
	reportType: reportType("report_type"),
	reportedItem: jsonb("reported_item"),
	targetUserNickname: text("target_user_nickname").notNull(),
	userNickname: text("user_nickname").notNull(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.targetUserNickname],
			foreignColumns: [users.nickname],
			name: "reports_target_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "reports_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const threadsPinned = pgTable("threads_pinned", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	threadId: uuid("thread_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "threads_pinned_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const threadsReactions = pgTable("threads_reactions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "threads_rating_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	threadId: uuid("thread_id").notNull(),
	userNickname: text("user_nickname").notNull(),
	emoji: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "threads_rating_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "threads_rating_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const threadsImages = pgTable("threads_images", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "threads_images_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	imageUrl: text("image_url").notNull(),
	threadId: uuid("thread_id").notNull(),
}, (table) => [
	index("threads_images_thread_id_idx").using("btree", table.threadId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "threads_images_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const threads = pgTable("threads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	visibility: postVisibility().default('all'),
	description: text(),
	isComments: boolean("is_comments").default(true).notNull(),
	permission: boolean().default(false).notNull(),
	isUpdated: boolean("is_updated").default(false).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }).notNull(),
	content: jsonb().notNull(),
	href: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.id],
			name: "threads_category_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("threads_href_key").on(table.href),
	check("threads_title_check", sql`length(title) < 200`),
]);

export const threadsViews = pgTable("threads_views", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "threads_views_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	threadId: uuid("thread_id").notNull(),
	userNickname: text("user_nickname").notNull(),
}, (table) => [
	index("threads_views_thread_id_idx").using("btree", table.threadId.asc().nullsLast().op("uuid_ops")),
	index("threads_views_user_nickname_idx").using("btree", table.userNickname.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "threads_views_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "threads_views_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	unique("threads_views_thread_user_unique").on(table.threadId, table.userNickname),
]);

export const threadsTags = pgTable("threads_tags", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "threads_tags_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	tags: text().array().notNull(),
	threadId: uuid("thread_id").notNull(),
}, (table) => [
	index("threads_tags_tags_idx").using("gin", table.tags.asc().nullsLast().op("array_ops")),
	index("threads_tags_thread_id_idx").using("btree", table.threadId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "threads_tags_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const users = pgTable("users", {
	birthday: date(),
	coverImage: text("cover_image"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	description: text(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameColor: text("name_color").default('#ffffff').notNull(),
	nickname: text().notNull(),
	realName: text("real_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	favoriteItem: bigint("favorite_item", { mode: "number" }),
	donate: donateVariants().default('default').notNull(),
	accountStatus: userAccountStatus("account_status"),
	avatar: text(),
}, (table) => [
	index("idx_users_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_users_nickname").using("btree", table.nickname.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.favoriteItem],
			foreignColumns: [configMinecraftItems.id],
			name: "users_favorite_item_fkey"
		}),
	unique("users_nickname_key").on(table.nickname),
	check("users_description_check", sql`length(description) < 64`),
]);

export const usersBanned = pgTable("users_banned", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_banned_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	nickname: text().notNull(),
	reason: text(),
	time: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_banned_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usersFriends = pgTable("users_friends", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user1: text("user_1").notNull(),
	user2: text("user_2").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_sort_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_user_1").using("btree", table.user1.asc().nullsLast().op("text_ops")),
	index("idx_user_2").using("btree", table.user2.asc().nullsLast().op("text_ops")),
	uniqueIndex("unique_users_pair_idx").using("btree", sql`LEAST(user_1, user_2)`, sql`GREATEST(user_1, user_2)`),
	foreignKey({
			columns: [table.user1],
			foreignColumns: [users.nickname],
			name: "users_friends_user_1_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.user2],
			foreignColumns: [users.nickname],
			name: "users_friends_user_2_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	check("user_pair_check", sql`user_1 <> user_2`),
]);

export const usersBlocked = pgTable("users_blocked", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_blocked_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	initiator: text().notNull(),
	recipient: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	message: text(),
}, (table) => [
	uniqueIndex("unique_initiator_recipient_idx").using("btree", sql`LEAST(initiator, recipient)`, sql`GREATEST(initiator, recipient)`),
	foreignKey({
			columns: [table.initiator],
			foreignColumns: [users.nickname],
			name: "users_blocked_initiator_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [users.nickname],
			name: "users_blocked_recipient_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usersSavedThreads = pgTable("users_saved_threads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
	threadId: uuid("thread_id"),
}, (table) => [
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "users_saved_threads_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "users_saved_threads_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usersSecurity = pgTable("users_security", {
	email: varchar().primaryKey().notNull(),
	token: varchar(),
	userNickname: text("user_nickname").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "users_security_user_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usersSession = pgTable("users_session", {
	sessionId: text("session_id").primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	browser: text(),
	cpu: text(),
	ip: text().notNull(),
	os: text(),
	ua: text(),
	nickname: text().notNull(),
	device: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	token: text().notNull(),
	location: text().default('').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "users_session_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("users_session_session_id_key").on(table.sessionId),
]);

export const postsUsers = pgTable("posts_users", {
	postId: uuid("post_id").notNull(),
	nickname: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.nickname],
			foreignColumns: [users.nickname],
			name: "posts_users_nickname_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "posts_users_post_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.postId, table.nickname], name: "posts_users_pkey"}),
]);

export const threadsUsers = pgTable("threads_users", {
	threadId: uuid("thread_id").notNull(),
	userNickname: text("user_nickname").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.threadId],
			foreignColumns: [threads.id],
			name: "threads_users_thread_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userNickname],
			foreignColumns: [users.nickname],
			name: "threads_users_user_nickname_fkey"
		}),
	primaryKey({ columns: [table.threadId, table.userNickname], name: "threads_users_pkey"}),
]);
