import type { 
  admin, category, search, thread, post, 
  report, user, comment, reaction, shared, 
  root
} from "../index.ts"

export type ForumUserAppType = typeof user
export type ForumThreadAppType = typeof thread
export type ForumAdminAppType = typeof admin
export type ForumCategoriesAppType = typeof category
export type ForumCommentAppType = typeof comment
export type ForumReactionAppType = typeof reaction
export type ForumSharedAppType = typeof shared
export type ForumSearchAppType = typeof search
export type ForumPostAppType = typeof post
export type ForumReportAppType = typeof report
export type ForumRootAppType = typeof root