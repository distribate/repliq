import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserInfo(nickname: string) {
  return forumDB
    .selectFrom('users')
    .innerJoin("users_settings", "users.nickname", "users_settings.nickname")
    .select(eb => [
      "users.nickname",
      "users.name_color",
      "users.donate",
      "users.description",
      "users.cover_image",
      "users.favorite_item",
      "users.id",
      "users.real_name",
      "users_settings.accept_friend_request",
      "users_settings.cover_outline_visible",
      "users_settings.game_stats_visible",
      "users_settings.profile_visibility",
      "users_settings.real_name_visible",
      "users_settings.send_notifications",
      "users_settings.show_game_location",
      eb.cast<string>("users.created_at", "text").as("created_at"),
      eb.cast<string>("users.birthday", "text").as("birthday"),
    ])
    .where("users.nickname", "=", nickname)
    .executeTakeFirstOrThrow();
}