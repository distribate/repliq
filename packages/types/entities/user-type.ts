import type { Users } from "../db/forum-database-types";
import type { Selectable } from "kysely";

type Base = Selectable<Users>

export type UserDetailed = Omit<Base,
  | "favorite_item"
  | "birthday"
  | "created_at"
  | "donate"
  | "avatars"
> & {
  id: string,
  birthday: string | null
  created_at: string,
  favorite_item: number | string | null
  avatar: string | null,
  is_donate: boolean;
  preferences: {
    cover_outline_visible: boolean,
    accept_friend_request: boolean,
    real_name_visible: boolean,
    game_stats_visible: boolean,
    profile_visibility: "all" | "friends",
    send_notifications: boolean;
    show_game_location: boolean;
    notify_in_telegram: boolean
  },
}

export type UserShorted = Pick<Base, "account_status"> & Pick<UserDetailed,
  | "nickname"
  | "is_donate" 
  | "description" 
  | "cover_image" 
  | "name_color"
  | "id"
  | "avatar"
> & {
  preferences: {
    cover_outline_visible: boolean,
    show_game_location: boolean;
  },
}