import type { UserDetailed, UserShorted } from "@repo/types/entities/user-type";

export function isUserDetailed(user: UserShorted | UserDetailed): user is UserDetailed {
  return "favorite_item" in user && user.favorite_item !== undefined;
}

export function isUserShorted(user: UserShorted | UserDetailed): user is UserShorted {
  return "favorite_item" in user && user.favorite_item === undefined;
}