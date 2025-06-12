import { relations } from "drizzle-orm/relations";
import { users, usersGameStatus, usersSettings, notifications, usersStatus, usersProfiles, minecraftProfiles, refferals, issues, issuesApprovals, reports, reportsApprovals, usersPunish, events, eventsPlayers, usersCredentials, comments, commentsReplies, admins, configAlerts, usersFriends, friendsNotes, friendsPinned, infoFindout, friendsRequests, postsViews, posts, moderators, postsComments, profileViews, threads, threadsPinned, threadsReactions, threadsImages, category, threadsViews, threadsTags, configMinecraftItems, usersBanned, usersBlocked, usersSavedThreads, usersSecurity, usersSession, postsUsers, threadsUsers } from "./schema";

export const usersGameStatusRelations = relations(usersGameStatus, ({one}) => ({
	user: one(users, {
		fields: [usersGameStatus.nickname],
		references: [users.nickname]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	usersGameStatuses: many(usersGameStatus),
	usersSettings_nickname: many(usersSettings, {
		relationName: "usersSettings_nickname_users_nickname"
	}),
	usersSettings_userId: many(usersSettings, {
		relationName: "usersSettings_userId_users_id"
	}),
	notifications: many(notifications),
	usersStatuses: many(usersStatus),
	refferals_initiator: many(refferals, {
		relationName: "refferals_initiator_users_nickname"
	}),
	refferals_recipient: many(refferals, {
		relationName: "refferals_recipient_users_nickname"
	}),
	issuesApprovals: many(issuesApprovals),
	usersPunishes_nickname: many(usersPunish, {
		relationName: "usersPunish_nickname_users_nickname"
	}),
	usersPunishes_nickname: many(usersPunish, {
		relationName: "usersPunish_nickname_users_nickname"
	}),
	usersProfiles: many(usersProfiles),
	issues: many(issues),
	usersCredentials: many(usersCredentials),
	comments: many(comments),
	admins_nickname: many(admins, {
		relationName: "admins_nickname_users_nickname"
	}),
	admins_userId: many(admins, {
		relationName: "admins_userId_users_id"
	}),
	configAlerts: many(configAlerts),
	friendsNotes_initiator: many(friendsNotes, {
		relationName: "friendsNotes_initiator_users_nickname"
	}),
	friendsNotes_recipient: many(friendsNotes, {
		relationName: "friendsNotes_recipient_users_nickname"
	}),
	friendsPinneds_initiator: many(friendsPinned, {
		relationName: "friendsPinned_initiator_users_nickname"
	}),
	friendsPinneds_recipient: many(friendsPinned, {
		relationName: "friendsPinned_recipient_users_nickname"
	}),
	infoFindouts: many(infoFindout),
	friendsRequests_initiator: many(friendsRequests, {
		relationName: "friendsRequests_initiator_users_nickname"
	}),
	friendsRequests_recipient: many(friendsRequests, {
		relationName: "friendsRequests_recipient_users_nickname"
	}),
	postsViews: many(postsViews),
	moderators: many(moderators),
	postsComments: many(postsComments),
	profileViews_initiator: many(profileViews, {
		relationName: "profileViews_initiator_users_nickname"
	}),
	profileViews_recipient: many(profileViews, {
		relationName: "profileViews_recipient_users_nickname"
	}),
	reports_targetUserNickname: many(reports, {
		relationName: "reports_targetUserNickname_users_nickname"
	}),
	reports_userNickname: many(reports, {
		relationName: "reports_userNickname_users_nickname"
	}),
	threadsReactions: many(threadsReactions),
	threadsViews: many(threadsViews),
	configMinecraftItem: one(configMinecraftItems, {
		fields: [users.favoriteItem],
		references: [configMinecraftItems.id]
	}),
	usersBanneds: many(usersBanned),
	usersFriends_user1: many(usersFriends, {
		relationName: "usersFriends_user1_users_nickname"
	}),
	usersFriends_user2: many(usersFriends, {
		relationName: "usersFriends_user2_users_nickname"
	}),
	usersBlockeds_initiator: many(usersBlocked, {
		relationName: "usersBlocked_initiator_users_nickname"
	}),
	usersBlockeds_recipient: many(usersBlocked, {
		relationName: "usersBlocked_recipient_users_nickname"
	}),
	usersSavedThreads: many(usersSavedThreads),
	usersSecurities: many(usersSecurity),
	usersSessions: many(usersSession),
	postsUsers: many(postsUsers),
	threadsUsers: many(threadsUsers),
}));

export const usersSettingsRelations = relations(usersSettings, ({one}) => ({
	user_nickname: one(users, {
		fields: [usersSettings.nickname],
		references: [users.nickname],
		relationName: "usersSettings_nickname_users_nickname"
	}),
	user_userId: one(users, {
		fields: [usersSettings.userId],
		references: [users.id],
		relationName: "usersSettings_userId_users_id"
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.nickname],
		references: [users.nickname]
	}),
}));

export const usersStatusRelations = relations(usersStatus, ({one}) => ({
	user: one(users, {
		fields: [usersStatus.nickname],
		references: [users.nickname]
	}),
}));

export const minecraftProfilesRelations = relations(minecraftProfiles, ({one}) => ({
	usersProfile: one(usersProfiles, {
		fields: [minecraftProfiles.profileId],
		references: [usersProfiles.id]
	}),
}));

export const usersProfilesRelations = relations(usersProfiles, ({one, many}) => ({
	minecraftProfiles: many(minecraftProfiles),
	user: one(users, {
		fields: [usersProfiles.userId],
		references: [users.id]
	}),
}));

export const refferalsRelations = relations(refferals, ({one}) => ({
	user_initiator: one(users, {
		fields: [refferals.initiator],
		references: [users.nickname],
		relationName: "refferals_initiator_users_nickname"
	}),
	user_recipient: one(users, {
		fields: [refferals.recipient],
		references: [users.nickname],
		relationName: "refferals_recipient_users_nickname"
	}),
}));

export const issuesApprovalsRelations = relations(issuesApprovals, ({one}) => ({
	issue: one(issues, {
		fields: [issuesApprovals.issueId],
		references: [issues.id]
	}),
	user: one(users, {
		fields: [issuesApprovals.responser],
		references: [users.nickname]
	}),
}));

export const issuesRelations = relations(issues, ({one, many}) => ({
	issuesApprovals: many(issuesApprovals),
	user: one(users, {
		fields: [issues.userNickname],
		references: [users.nickname]
	}),
}));

export const reportsApprovalsRelations = relations(reportsApprovals, ({one}) => ({
	report: one(reports, {
		fields: [reportsApprovals.reportId],
		references: [reports.id]
	}),
}));

export const reportsRelations = relations(reports, ({one, many}) => ({
	reportsApprovals: many(reportsApprovals),
	user_targetUserNickname: one(users, {
		fields: [reports.targetUserNickname],
		references: [users.nickname],
		relationName: "reports_targetUserNickname_users_nickname"
	}),
	user_userNickname: one(users, {
		fields: [reports.userNickname],
		references: [users.nickname],
		relationName: "reports_userNickname_users_nickname"
	}),
}));

export const usersPunishRelations = relations(usersPunish, ({one}) => ({
	user_nickname: one(users, {
		fields: [usersPunish.nickname],
		references: [users.nickname],
		relationName: "usersPunish_nickname_users_nickname"
	}),
	user_nickname: one(users, {
		fields: [usersPunish.nickname],
		references: [users.nickname],
		relationName: "usersPunish_nickname_users_nickname"
	}),
}));

export const eventsPlayersRelations = relations(eventsPlayers, ({one}) => ({
	event: one(events, {
		fields: [eventsPlayers.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	eventsPlayers: many(eventsPlayers),
}));

export const usersCredentialsRelations = relations(usersCredentials, ({one}) => ({
	user: one(users, {
		fields: [usersCredentials.userId],
		references: [users.id]
	}),
}));

export const commentsRelations = relations(comments, ({one, many}) => ({
	user: one(users, {
		fields: [comments.userNickname],
		references: [users.nickname]
	}),
	commentsReplies_initiatorCommentId: many(commentsReplies, {
		relationName: "commentsReplies_initiatorCommentId_comments_id"
	}),
	commentsReplies_recipientCommentId: many(commentsReplies, {
		relationName: "commentsReplies_recipientCommentId_comments_id"
	}),
}));

export const commentsRepliesRelations = relations(commentsReplies, ({one}) => ({
	comment_initiatorCommentId: one(comments, {
		fields: [commentsReplies.initiatorCommentId],
		references: [comments.id],
		relationName: "commentsReplies_initiatorCommentId_comments_id"
	}),
	comment_recipientCommentId: one(comments, {
		fields: [commentsReplies.recipientCommentId],
		references: [comments.id],
		relationName: "commentsReplies_recipientCommentId_comments_id"
	}),
}));

export const adminsRelations = relations(admins, ({one}) => ({
	user_nickname: one(users, {
		fields: [admins.nickname],
		references: [users.nickname],
		relationName: "admins_nickname_users_nickname"
	}),
	user_userId: one(users, {
		fields: [admins.userId],
		references: [users.id],
		relationName: "admins_userId_users_id"
	}),
}));

export const configAlertsRelations = relations(configAlerts, ({one}) => ({
	user: one(users, {
		fields: [configAlerts.creator],
		references: [users.nickname]
	}),
}));

export const friendsNotesRelations = relations(friendsNotes, ({one}) => ({
	usersFriend: one(usersFriends, {
		fields: [friendsNotes.friendId],
		references: [usersFriends.id]
	}),
	user_initiator: one(users, {
		fields: [friendsNotes.initiator],
		references: [users.nickname],
		relationName: "friendsNotes_initiator_users_nickname"
	}),
	user_recipient: one(users, {
		fields: [friendsNotes.recipient],
		references: [users.nickname],
		relationName: "friendsNotes_recipient_users_nickname"
	}),
}));

export const usersFriendsRelations = relations(usersFriends, ({one, many}) => ({
	friendsNotes: many(friendsNotes),
	friendsPinneds: many(friendsPinned),
	user_user1: one(users, {
		fields: [usersFriends.user1],
		references: [users.nickname],
		relationName: "usersFriends_user1_users_nickname"
	}),
	user_user2: one(users, {
		fields: [usersFriends.user2],
		references: [users.nickname],
		relationName: "usersFriends_user2_users_nickname"
	}),
}));

export const friendsPinnedRelations = relations(friendsPinned, ({one}) => ({
	usersFriend: one(usersFriends, {
		fields: [friendsPinned.friendId],
		references: [usersFriends.id]
	}),
	user_initiator: one(users, {
		fields: [friendsPinned.initiator],
		references: [users.nickname],
		relationName: "friendsPinned_initiator_users_nickname"
	}),
	user_recipient: one(users, {
		fields: [friendsPinned.recipient],
		references: [users.nickname],
		relationName: "friendsPinned_recipient_users_nickname"
	}),
}));

export const infoFindoutRelations = relations(infoFindout, ({one}) => ({
	user: one(users, {
		fields: [infoFindout.userNickname],
		references: [users.nickname]
	}),
}));

export const friendsRequestsRelations = relations(friendsRequests, ({one}) => ({
	user_initiator: one(users, {
		fields: [friendsRequests.initiator],
		references: [users.nickname],
		relationName: "friendsRequests_initiator_users_nickname"
	}),
	user_recipient: one(users, {
		fields: [friendsRequests.recipient],
		references: [users.nickname],
		relationName: "friendsRequests_recipient_users_nickname"
	}),
}));

export const postsViewsRelations = relations(postsViews, ({one}) => ({
	user: one(users, {
		fields: [postsViews.nickname],
		references: [users.nickname]
	}),
	post: one(posts, {
		fields: [postsViews.postId],
		references: [posts.id]
	}),
}));

export const postsRelations = relations(posts, ({many}) => ({
	postsViews: many(postsViews),
	postsComments: many(postsComments),
	postsUsers: many(postsUsers),
}));

export const moderatorsRelations = relations(moderators, ({one}) => ({
	user: one(users, {
		fields: [moderators.userId],
		references: [users.id]
	}),
}));

export const postsCommentsRelations = relations(postsComments, ({one}) => ({
	user: one(users, {
		fields: [postsComments.userNickname],
		references: [users.nickname]
	}),
	post: one(posts, {
		fields: [postsComments.postId],
		references: [posts.id]
	}),
}));

export const profileViewsRelations = relations(profileViews, ({one}) => ({
	user_initiator: one(users, {
		fields: [profileViews.initiator],
		references: [users.nickname],
		relationName: "profileViews_initiator_users_nickname"
	}),
	user_recipient: one(users, {
		fields: [profileViews.recipient],
		references: [users.nickname],
		relationName: "profileViews_recipient_users_nickname"
	}),
}));

export const threadsPinnedRelations = relations(threadsPinned, ({one}) => ({
	thread: one(threads, {
		fields: [threadsPinned.threadId],
		references: [threads.id]
	}),
}));

export const threadsRelations = relations(threads, ({one, many}) => ({
	threadsPinneds: many(threadsPinned),
	threadsReactions: many(threadsReactions),
	threadsImages: many(threadsImages),
	category: one(category, {
		fields: [threads.categoryId],
		references: [category.id]
	}),
	threadsViews: many(threadsViews),
	threadsTags: many(threadsTags),
	usersSavedThreads: many(usersSavedThreads),
	threadsUsers: many(threadsUsers),
}));

export const threadsReactionsRelations = relations(threadsReactions, ({one}) => ({
	thread: one(threads, {
		fields: [threadsReactions.threadId],
		references: [threads.id]
	}),
	user: one(users, {
		fields: [threadsReactions.userNickname],
		references: [users.nickname]
	}),
}));

export const threadsImagesRelations = relations(threadsImages, ({one}) => ({
	thread: one(threads, {
		fields: [threadsImages.threadId],
		references: [threads.id]
	}),
}));

export const categoryRelations = relations(category, ({many}) => ({
	threads: many(threads),
}));

export const threadsViewsRelations = relations(threadsViews, ({one}) => ({
	thread: one(threads, {
		fields: [threadsViews.threadId],
		references: [threads.id]
	}),
	user: one(users, {
		fields: [threadsViews.userNickname],
		references: [users.nickname]
	}),
}));

export const threadsTagsRelations = relations(threadsTags, ({one}) => ({
	thread: one(threads, {
		fields: [threadsTags.threadId],
		references: [threads.id]
	}),
}));

export const configMinecraftItemsRelations = relations(configMinecraftItems, ({many}) => ({
	users: many(users),
}));

export const usersBannedRelations = relations(usersBanned, ({one}) => ({
	user: one(users, {
		fields: [usersBanned.nickname],
		references: [users.nickname]
	}),
}));

export const usersBlockedRelations = relations(usersBlocked, ({one}) => ({
	user_initiator: one(users, {
		fields: [usersBlocked.initiator],
		references: [users.nickname],
		relationName: "usersBlocked_initiator_users_nickname"
	}),
	user_recipient: one(users, {
		fields: [usersBlocked.recipient],
		references: [users.nickname],
		relationName: "usersBlocked_recipient_users_nickname"
	}),
}));

export const usersSavedThreadsRelations = relations(usersSavedThreads, ({one}) => ({
	thread: one(threads, {
		fields: [usersSavedThreads.threadId],
		references: [threads.id]
	}),
	user: one(users, {
		fields: [usersSavedThreads.userId],
		references: [users.id]
	}),
}));

export const usersSecurityRelations = relations(usersSecurity, ({one}) => ({
	user: one(users, {
		fields: [usersSecurity.userNickname],
		references: [users.nickname]
	}),
}));

export const usersSessionRelations = relations(usersSession, ({one}) => ({
	user: one(users, {
		fields: [usersSession.nickname],
		references: [users.nickname]
	}),
}));

export const postsUsersRelations = relations(postsUsers, ({one}) => ({
	user: one(users, {
		fields: [postsUsers.nickname],
		references: [users.nickname]
	}),
	post: one(posts, {
		fields: [postsUsers.postId],
		references: [posts.id]
	}),
}));

export const threadsUsersRelations = relations(threadsUsers, ({one}) => ({
	thread: one(threads, {
		fields: [threadsUsers.threadId],
		references: [threads.id]
	}),
	user: one(users, {
		fields: [threadsUsers.userNickname],
		references: [users.nickname]
	}),
}));