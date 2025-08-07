import type {
  ForumUserAppType,
  ForumThreadAppType,
  ForumAdminAppType,
  ForumCategoriesAppType,
  ForumCommentAppType,
  ForumReactionAppType,
  ForumSharedAppType,
  ForumSearchAppType,
  ForumPostAppType,
  ForumReportAppType,
  ForumRootAppType
} from 'forum-backend/src/types/routes-types.ts';
import { hc } from 'hono/client';
import { fetchOptions } from './init.ts';

const forumBaseUrl = import.meta.env.PUBLIC_ENV__API_PREFIX_URL

if (!forumBaseUrl) {
  throw new Error(`forumBaseUrl is not defined`)
}

export const forumSearchClient = hc<ForumSearchAppType>(forumBaseUrl, fetchOptions)
export const forumSharedClient = hc<ForumSharedAppType>(forumBaseUrl, fetchOptions)
export const forumReactionClient = hc<ForumReactionAppType>(forumBaseUrl, fetchOptions)
export const forumCommentClient = hc<ForumCommentAppType>(forumBaseUrl, fetchOptions)
export const forumUserClient = hc<ForumUserAppType>(forumBaseUrl, fetchOptions)
export const forumThreadClient = hc<ForumThreadAppType>(forumBaseUrl, fetchOptions)
export const forumCategoriesClient = hc<ForumCategoriesAppType>(forumBaseUrl, fetchOptions)
export const forumAdminClient = hc<ForumAdminAppType>(forumBaseUrl, fetchOptions)
export const forumPostClient = hc<ForumPostAppType>(forumBaseUrl, fetchOptions)
export const forumReportClient = hc<ForumReportAppType>(forumBaseUrl, fetchOptions)
export const forumRootClient = hc<ForumRootAppType>(forumBaseUrl, fetchOptions)