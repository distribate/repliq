import { hc } from 'hono/client';
import { fetchOptions } from './init.ts';
import { mainBaseUrl } from './api/init.ts';
import type {
  UserAppType,
  ThreadAppType,
  AdminAppType,
  CategoriesAppType,
  CommentAppType,
  SharedAppType,
  SearchAppType,
  PostAppType,
  ReportAppType,
  RootAppType,
  FriendAppType
} from 'backend/src/types/routes-types.ts';

export const searchClient = hc<SearchAppType>(mainBaseUrl, fetchOptions)
export const sharedClient = hc<SharedAppType>(mainBaseUrl, fetchOptions)
export const commentClient = hc<CommentAppType>(mainBaseUrl, fetchOptions)
export const userClient = hc<UserAppType>(mainBaseUrl, fetchOptions)
export const threadClient = hc<ThreadAppType>(mainBaseUrl, fetchOptions)
export const categoriesClient = hc<CategoriesAppType>(mainBaseUrl, fetchOptions)
export const adminClient = hc<AdminAppType>(mainBaseUrl, fetchOptions)
export const postClient = hc<PostAppType>(mainBaseUrl, fetchOptions)
export const reportClient = hc<ReportAppType>(mainBaseUrl, fetchOptions)
export const rootClient = hc<RootAppType>(mainBaseUrl, fetchOptions)
export const friendClient = hc<FriendAppType>(mainBaseUrl, fetchOptions)