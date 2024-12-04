import { AlignJustify, LayoutGrid } from "lucide-react";

type ViewComponentsType = "grid" | "list";

type ViewComponents = {
  value: ViewComponentsType;
  title: string;
  icon: any;
};

export const VIEW_COMPONENTS_TYPE: ViewComponents[] = [
  { value: "list", title: "Список", icon: AlignJustify },
  { value: "grid", title: "Сетка", icon: LayoutGrid },
];
