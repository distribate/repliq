import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserInfo(nickname: string) {
  return forumDB
    .selectFrom('users')
    .innerJoin("users_settings", "users.nickname", "users_settings.nickname")
    .leftJoin("users_subs", "users.nickname", "users_subs.nickname")
    .select(eb => [
      "users.nickname",
      "users.name_color",
      "users.description",
      "users.cover_image",
      "users.favorite_item",
      "users.avatar",
      "users.id",
      "users.real_name",
      "users_settings.accept_friend_request",
      "users_settings.cover_outline_visible",
      "users_settings.game_stats_visible",
      "users_settings.profile_visibility",
      "users_settings.real_name_visible",
      "users_settings.send_notifications",
      "users_settings.show_game_location",
      "users_settings.notify_in_telegram",
      eb.cast<string>("users.created_at", "text").as("created_at"),
      eb.cast<string>("users.birthday", "text").as("birthday"),
      eb.case()
        .when('users_subs.id', 'is not', null)
        .then(true)
        .else(false) 
        .end()
        .as('is_donate')
    ])
    .where("users.nickname", "=", nickname)
    .executeTakeFirstOrThrow();
}