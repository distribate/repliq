import { Tables } from "./supabase";

export type UserEntity = Tables<"users">
export type FriendEntity = Tables<"users_friends">
export type FriendRequestEntity = Tables<"friends_requests">
export type FriendPinnedEntity = Tables<"friends_pinned">
export type FriendNotesEntity = Tables<"friends_notes">
export type PostEntity = Tables<"posts">
export type PostCommentEntity = Tables<"posts_comments">
export type PostCommentRefEntity = Tables<"posts_comments_ref">
export type CategoryEntity = Tables<"category">
export type ThreadEntity = Tables<"threads">
export type AlertEntity = Tables<"config_alerts">
export type MinecraftItemEntity = Tables<"config_minecraft_items">
export type ThreadCommentEntity = Tables<"threads_comments">
export type ThreadCommentEntityRef = Tables<"threads_comments_ref">
export type ThreadCommentRepliedEntity = Tables<"threads_comments_replies">
export type ThreadRatingEntity = Tables<"threads_rating">
export type ReportEntity = Tables<"reports">
export type BanEntity = Tables<"users_banned">
export type RequestEntity = Tables<"users_requests_timeout">