import {
  getPreferenceValue, UserPreferences,
} from './convert-user-preferences-to-map.ts';

type CheckUserGameStatsVisibility = {
  preferences: UserPreferences,
  currentUserNickname: string,
  reqUserNickname: string
}

export function checkUserGameStatsVisibility({
  preferences, currentUserNickname, reqUserNickname
}: CheckUserGameStatsVisibility): boolean {
  const gameStatsShow = getPreferenceValue(preferences, "gameStatsVisibility")

  if (currentUserNickname === reqUserNickname) return true;
  
  return gameStatsShow;
}