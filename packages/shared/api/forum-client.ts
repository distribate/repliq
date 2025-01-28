import {
  ForumUserAppType,
  ForumThreadAppType,
  ForumAdminAppType,
  ForumCategoriesAppType,
  ForumCommentAppType,
  ForumReactionAppType,
  ForumSharedAppType,
  ForumWebSocketAppType,
  ForumLandingAppType,
  ForumSearchAppType,
  ForumPostAppType,
  ForumReportAppType
} from 'forum-backend/src/types/routes-types.ts';
import { hc } from 'hono/client';
import { isProduction } from "@repo/lib/helpers/is-production";
import { fetchOptions } from '../constants/fetch-options.ts';

const baseUrl = isProduction ? `https://cc.fasberry.su/api/forum` : `http://localhost:4101/api/forum`

export const forumLandingClient = hc<ForumLandingAppType>(baseUrl, fetchOptions)
export const forumSearchClient = hc<ForumSearchAppType>(baseUrl, fetchOptions)
export const forumSharedClient = hc<ForumSharedAppType>(baseUrl, fetchOptions)
export const forumWsClient = hc<ForumWebSocketAppType>(baseUrl, fetchOptions)
export const forumReactionClient = hc<ForumReactionAppType>(baseUrl, fetchOptions)
export const forumCommentClient = hc<ForumCommentAppType>(baseUrl, fetchOptions)
export const forumUserClient = hc<ForumUserAppType>(baseUrl, fetchOptions)
export const forumThreadClient = hc<ForumThreadAppType>(baseUrl, fetchOptions)
export const forumCategoriesClient = hc<ForumCategoriesAppType>(baseUrl, fetchOptions)
export const forumAdminClient = hc<ForumAdminAppType>(baseUrl, fetchOptions)
export const forumPostClient = hc<ForumPostAppType>(baseUrl, fetchOptions)
export const forumReportClient = hc<ForumReportAppType>(baseUrl, fetchOptions)