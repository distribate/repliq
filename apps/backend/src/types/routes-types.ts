import type { admin } from "#routes/admin/index.ts"
import type { category } from "#routes/categories/index.ts"
import type { comment } from "#routes/comments/index.ts"
import type { friend } from "#routes/friend/index.ts"
import type { post } from "#routes/post/index.ts"
import type { shared } from "#routes/public/index.ts"
import type { report } from "#routes/report/index.ts"
import type { root } from "#routes/root/index.ts"
import type { search } from "#routes/search/index.ts"
import type { thread } from "#routes/thread/index.ts"
import type { user } from "#routes/user/index.ts"

export type UserAppType = typeof user
export type ThreadAppType = typeof thread
export type AdminAppType = typeof admin
export type CategoriesAppType = typeof category
export type CommentAppType = typeof comment
export type SharedAppType = typeof shared
export type SearchAppType = typeof search
export type PostAppType = typeof post
export type ReportAppType = typeof report
export type RootAppType = typeof root
export type FriendAppType = typeof friend