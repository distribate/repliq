import { Database, Tables } from './gen-supabase.ts';
import { DonateType } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';

export type UserEntity = Tables<"users">
export type ExtendedUserEntity = Tables<"users"> & {
  donate: DonateType["primary_group"]
}
export type FriendEntity = Tables<"users_friends">
export type FriendRequestEntity = Tables<"friends_requests">
export type FriendPinnedEntity = Tables<"friends_pinned">
export type FriendNotesEntity = Tables<"friends_notes">
export type PostEntity = Tables<"posts">
export type PostCommentEntity = Tables<"posts_comments">
export type CategoryEntity = Tables<"category">
export type ThreadEntity = Tables<"threads">
export type AlertEntity = Tables<"config_alerts">
export type MinecraftItemEntity = Tables<"config_minecraft_items">
export type ThreadCommentEntity = Tables<"threads_comments">
export type ThreadCommentRepliedEntity = Tables<"threads_comments_replies">
export type ThreadRatingEntity = Tables<"threads_rating">
export type ReportEntity = Tables<"reports">
export type BanEntity = Tables<"users_banned">
export type RequestEntity = Tables<"users_requests_timeout">

export type ProfileVisibilityEnum = Database["public"]["Enums"]["profile_visibility"]
export type PostVisibilityEnum = Database['public']['Enums']['post_visibility']
export type ReportReasonEnum = Database["public"]["Enums"]["report_reason"]
export type ThreadRatingEnum = Database["public"]["Enums"]["thread_rating_type"]
export type DonateVariantsEnum = Database["public"]['Enums']['donate_variants']

export type RequestDetails = Partial<{
  range: number[],
  limit: number,
  ascending: boolean
}>