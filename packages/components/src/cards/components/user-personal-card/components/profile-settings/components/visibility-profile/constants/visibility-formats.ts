type VisibilityItems = {
  title: string;
  value: "all" | "friends"
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
