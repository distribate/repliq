import { getPreferenceValue, UserPreferences } from './convert-user-preferences-to-map.ts';

type CheckUserRealNameVisibility = {
  preferences: UserPreferences,
  currentUserNickname: string,
  reqUserNickname: string
}

export function checkUserRealNameVisibility({
  reqUserNickname, currentUserNickname, preferences
}: CheckUserRealNameVisibility) {
  const isRealNameShow: boolean = getPreferenceValue(preferences, "realNameVisibility")
  
  if (currentUserNickname === reqUserNickname) return true;
  
  return isRealNameShow;
}