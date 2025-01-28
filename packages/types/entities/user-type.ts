import type { Users } from "../db/forum-database-types";
import type { DonateVariantsEnum } from "./entities-type";
import type { Selectable } from "kysely";

export type UserDetailed = Omit<Selectable<Users>,
  | "favorite_item"
  | "birthday"
  | "created_at"
  | "donate"
> & {
    birthday: string | null
    created_at: string,
    favorite_item: number | null
    donate: DonateVariantsEnum;
    preferences: {
      cover_outline_visible: boolean,
      accept_friend_request: boolean,
      real_name_visible: boolean,
      game_stats_visible: boolean,
      profile_visibility: "all" | "friends",
      send_notifications: boolean
    },
  }

export type UserShorted = {
  donate: DonateVariantsEnum,
  nickname: string,
  name_color: string,
  description: string | null,
  preferences: {
    cover_outline_visible: boolean,
  },
}