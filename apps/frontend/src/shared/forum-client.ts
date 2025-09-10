import { hc } from 'hono/client';
import { fetchOptions } from './init.ts';
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
import { MAIN_BASE_URL } from './env/index.ts';

export const searchClient = hc<SearchAppType>(MAIN_BASE_URL, fetchOptions)
export const sharedClient = hc<SharedAppType>(MAIN_BASE_URL, fetchOptions)
export const commentClient = hc<CommentAppType>(MAIN_BASE_URL, fetchOptions)
export const userClient = hc<UserAppType>(MAIN_BASE_URL, fetchOptions)
export const threadClient = hc<ThreadAppType>(MAIN_BASE_URL, fetchOptions)
export const categoriesClient = hc<CategoriesAppType>(MAIN_BASE_URL, fetchOptions)
export const adminClient = hc<AdminAppType>(MAIN_BASE_URL, fetchOptions)
export const postClient = hc<PostAppType>(MAIN_BASE_URL, fetchOptions)
export const reportClient = hc<ReportAppType>(MAIN_BASE_URL, fetchOptions)
export const rootClient = hc<RootAppType>(MAIN_BASE_URL, fetchOptions)
export const friendClient = hc<FriendAppType>(MAIN_BASE_URL, fetchOptions)