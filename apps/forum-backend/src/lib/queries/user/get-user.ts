import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import type { UserDonateVariant } from "@repo/types/entities/entities-type";
import type { UserDetailed, UserShorted } from "@repo/types/entities/user-type";

export type GetUserType = "shorted" | "detailed"

type GetUser = InitiatorRecipientType & {
  type: GetUserType,
}

export async function getUser<T extends GetUserType>({
  initiator, recipient, type
}: GetUser): Promise<T extends "shorted" ? UserShorted : UserDetailed> {
  const query = await forumDB
    .selectFrom("users")
    .innerJoin("users_settings", "users.nickname", "users_settings.nickname")
    .select([
      "users.nickname",
      "users.description",
      "users.donate",
      "users.real_name",
      "users.created_at",
      "users.birthday",
      "users.name_color",
      "users.favorite_item",
      "users.uuid",
      "users_settings.accept_friend_request",
      "users_settings.cover_outline_visible",
      "users_settings.game_stats_visible",
      "users_settings.profile_visibility",
      "users_settings.real_name_visible",
    ])
    .where("users.nickname", "=", recipient)
    .executeTakeFirstOrThrow();

  const isIdentity = initiator === recipient;

  const {
    accept_friend_request, cover_outline_visible, game_stats_visible, profile_visibility, real_name_visible,
    real_name, created_at, birthday, favorite_item, donate, ...userWithoutSensitiveInfo
  } = query;

  if (type === "shorted" && !isIdentity) {
    return {
      nickname: userWithoutSensitiveInfo.nickname,
      description: userWithoutSensitiveInfo.description,
      name_color: userWithoutSensitiveInfo.name_color,
      donate: donate satisfies UserDonateVariant,
      preferences: {
        cover_outline_visible,
      },
    } as T extends "shorted" ? UserShorted : UserDetailed;
  }

  const userDetails = {
    ...userWithoutSensitiveInfo,
    real_name: real_name_visible || isIdentity ? real_name : null,
    created_at: created_at.toString(),
    uuid: userWithoutSensitiveInfo.uuid,
    birthday: birthday ? birthday.toString() : null,
    favorite_item: favorite_item ? Number(favorite_item) : null,
    donate: donate satisfies UserDonateVariant,
    preferences: {
      cover_outline_visible,
      accept_friend_request,
      game_stats_visible,
      profile_visibility,
      real_name_visible
    },
  };

  return userDetails as T extends "shorted" ? UserShorted : UserDetailed;
}