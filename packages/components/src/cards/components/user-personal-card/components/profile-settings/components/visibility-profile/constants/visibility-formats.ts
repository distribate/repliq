import { ProfileVisibilityChangeType } from "../types/visibility-types.ts";

type VisibilityItems = {
  title: string;
  value: ProfileVisibilityChangeType["visibility"];
};

export const VISIBILITY_FORMATS: VisibilityItems[] = [
  {
    title: "открытый",
    value: "all",
  },
  {
    title: "закрытый",
    value: "friends",
  },
];
