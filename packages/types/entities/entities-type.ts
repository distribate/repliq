import type { Database, Tables } from "./gen-supabase.ts";

export type UserEntity = Tables<"users">;
export type UsersSessionEntity = Tables<"users_session">;
export type ExtendedUserEntity = Tables<"users"> & {
  donate: DonateVariantsEnum
};

export type FriendEntity = Tables<"users_friends">;
export type FriendRequestEntity = Tables<"friends_requests">;
export type FriendPinnedEntity = Tables<"friends_pinned">;
export type FriendNotesEntity = Tables<"friends_notes">;

export type PostEntity = Tables<"posts">;
export type PostCommentEntity = Tables<"posts_comments">;
export type PostVisibilityEnum = Database["public"]["Enums"]["post_visibility"];

export type ThreadEntity = Tables<"threads">;
export type ThreadRatingEnum = Database["public"]["Enums"]["thread_rating_type"];

export type AlertEntity = {
  id: number,
  link: string | null,
  creator: {
    nickname: string,
    avatar: string | null
  }
  created_at: string | Date,
  title: string,
  description: string | null
}

export type MinecraftItemEntity = Tables<"config_minecraft_items">;
export type BanEntity = Tables<"users_banned">;

export type ProfileVisibilityEnum = Database["public"]["Enums"]["profile_visibility"];
export type ReportEntity = Tables<"reports">;
export type ReportReasonEnum = Database["public"]["Enums"]["report_reason"];
export type DonateVariantsEnum = Database["public"]["Enums"]["donate_variants"];

export type UserDonateVariant = DonateVariantsEnum

export type RequestDetails = Partial<{
  range: number[];
  limit: number;
  ascending: boolean;
}>;