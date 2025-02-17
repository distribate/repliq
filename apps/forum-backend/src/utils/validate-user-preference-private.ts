import { getFriendship } from "#lib/queries/friend/get-friendship.ts"
import type { UserSettingsKeys } from "#shared/constants/user-settings.ts"
import { forumDB } from "#shared/database/forum-db.ts"

type UserPreferenceValidation = {
  key?: Exclude<UserSettingsKeys, "profile_visibility">
  initiator: string
  recipient: string
}

export async function userPreferenceAndPrivateValidation({
  key, initiator, recipient
}: UserPreferenceValidation) {
  if (initiator === recipient) return true;

  let query = forumDB
    .selectFrom("users_settings")

  const userSettings = await query
    .select([key ?? "id", "profile_visibility"])
    .where("nickname", "=", recipient)
    .executeTakeFirstOrThrow()

  if (userSettings.profile_visibility === "friends") {
    const friendship = await getFriendship({ initiator, recipient })

    if (!friendship) {
      return false
    }

    return true
  }

  if (key) {
    const { id, profile_visibility, ...preferences } = userSettings

    if (preferences[key] === false) {
      return false
    }

    return true;
  }

  return true
}