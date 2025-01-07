import type { admin, category, thread, user, comment, reaction } from "#index.ts"

export type ForumUserAppType = typeof user
export type ForumThreadAppType = typeof thread
export type ForumAdminAppType = typeof admin
export type ForumCategoriesAppType = typeof category
export type ForumCommentAppType = typeof comment
export type ForumReactionAppType = typeof reaction