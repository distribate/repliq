CREATE TABLE `advertisement` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`embedded` text,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`owner` text NOT NULL,
	`link` text
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`creator` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`imageUrl` text NOT NULL,
	`value` text,
	`isPublic` numeric DEFAULT (TRUE) NOT NULL,
	`isAvailable` numeric DEFAULT (TRUE) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `errors_logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`initiator` text NOT NULL,
	`recipient` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`reward` text NOT NULL,
	`origin` text NOT NULL,
	`imageUrl` text,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events_players` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_id` integer NOT NULL,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`nickname` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ip_list` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ip` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media_links` (
	`id` integer PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`link` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `minecraft_facts` (
	`id` integer PRIMARY KEY NOT NULL,
	`fact` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `minecraft_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `minecraft_news` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`media_links` text,
	`tags` text,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`imageUrl` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `modpack` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`name` text NOT NULL,
	`client` text NOT NULL,
	`version` text NOT NULL,
	`mods` text NOT NULL,
	`imageUrl` text NOT NULL,
	`downloadLink` text NOT NULL,
	`shaders` text
);
--> statement-breakpoint
CREATE TABLE `rules_rule_content` (
	`id` integer PRIMARY KEY NOT NULL,
	`rule_list_id` text NOT NULL,
	`title` text NOT NULL,
	`punishment` text,
	`description` text,
	`subtitle` text
);
--> statement-breakpoint
CREATE TABLE `rules_termin_content` (
	`id` integer PRIMARY KEY NOT NULL,
	`article_title` text NOT NULL,
	`article_desc` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `voted_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`nickname` text NOT NULL
);
