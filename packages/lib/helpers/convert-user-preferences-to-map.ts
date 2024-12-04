import { parseStringToBoolean } from "./parse-string-to-boolean.ts";

export type UserPreferences = {
  coverOutline: boolean;
  friendRequest: boolean;
  realNameVisibility: boolean;
  gameStatsVisibility: boolean;
};

export function getPreferenceValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function convertUserPreferencesToObject(
  preferences: Record<string, string>,
): UserPreferences {
  return {
    coverOutline: parseStringToBoolean(preferences.coverOutline),
    friendRequest: parseStringToBoolean(preferences.friendRequest),
    gameStatsVisibility: parseStringToBoolean(preferences.gameStatsVisibility),
    realNameVisibility: parseStringToBoolean(preferences.realNameVisibility),
  };
}
