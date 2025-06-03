import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import type { UserDetailed, UserShorted } from "@repo/types/entities/user-type";

export type GetUserType = "shorted" | "detailed"

type GetUser = InitiatorRecipientType & {
  type: GetUserType,
}

async function getUserShortedDetails(recipient: string) {
  const query = await forumDB
    .selectFrom("users")
    .innerJoin("users_settings", "users.nickname", "users_settings.nickname")
    .select(eb => [
      "users.id",
      "users.nickname",
      "users.description",
      "users.account_status",
      "users.donate",
      "users.name_color",
      "users.cover_image",
      "users_settings.cover_outline_visible",
      "users_settings.show_game_location",
    ])
    .where("users.nickname", "=", recipient)
    .executeTakeFirst();

  return query;
}

async function getUserFullDetails(recipient: string) {
  const query = await forumDB
    .selectFrom("users")
    .innerJoin("users_settings", "users.nickname", "users_settings.nickname")
    .select(eb => [
      "users.id",
      "users.nickname",
      "users.description",
      "users.donate",
      "users.real_name",
      "users.account_status",
      "users.name_color",
      "users.favorite_item",
      "users.cover_image",
      "users_settings.accept_friend_request",
      "users_settings.cover_outline_visible",
      "users_settings.game_stats_visible",
      "users_settings.profile_visibility",
      "users_settings.real_name_visible",
      "users_settings.show_game_location",
      eb.cast<string>("users.created_at", "text").as("created_at"),
      eb.cast<string>("users.birthday", "text").as("birthday"),
    ])
    .where("users.nickname", "=", recipient)
    .executeTakeFirst();

  return query;
}

export async function getUserProfilePreview(recipient: string): Promise<UserShorted | null> {
  const query = await getUserShortedDetails(recipient)

  if (!query) return null;

  const {
    cover_outline_visible, show_game_location, cover_image,
    nickname, description, name_color, donate, account_status
  } = query;

  // @ts-expect-error
  const userDetails: UserShorted = {
    nickname,
    description,
    name_color,
    account_status,
    cover_image,
    donate,
    preferences: {
      cover_outline_visible, show_game_location
    },
  };

  return userDetails
}

export async function getUser<T extends GetUserType>({
  initiator, recipient, type
}: GetUser): Promise<T extends "shorted" ? UserShorted | null : UserDetailed | null> {
  const query = await getUserFullDetails(recipient)

  if (!query) return null;

  const isIdentity = initiator === recipient;

  const {
    accept_friend_request, cover_outline_visible, game_stats_visible, profile_visibility,
    real_name_visible, real_name, created_at, birthday, favorite_item, show_game_location,
    ...userWithoutSensitiveInfo
  } = query;

  const userDetails = {
    ...userWithoutSensitiveInfo,
    real_name: real_name_visible || isIdentity ? real_name : null,
    favorite_item: favorite_item ? Number(favorite_item) : null,
    preferences: {
      cover_outline_visible,
      accept_friend_request,
      game_stats_visible,
      profile_visibility,
      real_name_visible,
      show_game_location
    },
  };

  if (type === "shorted" && !isIdentity) {
    const { nickname, description, name_color, donate, account_status } = userWithoutSensitiveInfo;

    return {
      nickname,
      description,
      name_color,
      account_status,
      donate,
      preferences: {
        cover_outline_visible, show_game_location
      },
    } as T extends "shorted" ? UserShorted : UserDetailed;
  }

  return userDetails as T extends "shorted" ? UserShorted : UserDetailed;
}