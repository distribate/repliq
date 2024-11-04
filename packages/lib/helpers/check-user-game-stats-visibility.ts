import {
  getPreferenceValue, UserPreferences,
} from './convert-user-preferences-to-map.ts';

type CheckUserGameStatsVisibility = {
  preferences: UserPreferences,
  currentUserNickname: string,
  requestedUserNickname: string
}

export function checkUserGameStatsVisibility({
  preferences, currentUserNickname, requestedUserNickname
}: CheckUserGameStatsVisibility): boolean {
  const gameStatsShow = getPreferenceValue(preferences, "gameStatsVisibility")

  if (currentUserNickname === requestedUserNickname) return true;
  
  return gameStatsShow;
}