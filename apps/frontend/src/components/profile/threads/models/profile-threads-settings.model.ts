import { atom } from "@reatom/core";

export type ProfileThreadsViewType = "grid" | "list";

export type ProfileThreadsSettingsQuery = {
  viewType: ProfileThreadsViewType;
  query: string | null;
};

const initial: ProfileThreadsSettingsQuery = {
  viewType: "list",
  query: null,
};

export const profileThreadsSettingsAtom = atom<ProfileThreadsSettingsQuery>(initial, "profileThreadsSettings")