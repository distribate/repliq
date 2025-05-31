import { requestedUserParamAtom, requestedUserPreferencesAtom } from "#components/profile/main/models/requested-user.model";
import { action, atom } from "@reatom/core";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { toast } from "sonner";

type Cover = {
  inView: boolean,
  location: {
    opened: boolean
  }
};

const initial: Cover = {
  inView: true,
  location: {
    opened: false
  }
};

export const coverAtom = atom<Cover>(initial, "cover")

export const openLocationViewerAction = action((ctx) => {
  const currentUserNickname = ctx.get(currentUserNicknameAtom)
  if (!currentUserNickname) return;

  const requestedUserPreferences = ctx.get(requestedUserPreferencesAtom)
  const requestedUserNickname = ctx.get(requestedUserParamAtom)
  if (!requestedUserPreferences || !requestedUserNickname) return;

  const showLocation = requestedUserPreferences.show_game_location

  if (!showLocation && currentUserNickname !== requestedUserNickname) {
    return toast.warning("Игрок не показывает свое игровое местоположение")
  }

  coverAtom(ctx, (state: Cover) => ({ ...state, location: { opened: true } }))
})