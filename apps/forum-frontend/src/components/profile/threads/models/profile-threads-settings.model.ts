import { atom } from "@reatom/core";

export type ProfileThreadsViewType = "grid" | "list";

export type ProfileThreadsSettingsQuery = {
  viewType: ProfileThreadsViewType;
  querySearch: string | null;
};

const initial: ProfileThreadsSettingsQuery = {
  viewType: "list",
  querySearch: null,
};

export const profileThreadsSettingsAtom = atom<ProfileThreadsSettingsQuery>(initial, "profileThreadsSettings")