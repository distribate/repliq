import { SidebarFormat } from "../../sidebar-layout/queries/sidebar-layout-query.ts";

type SidebarFormats = {
  title: string;
  value: SidebarFormat;
};

export const SIDEBAR_FORMATS: SidebarFormats[] = [
  {
    title: "Резиновый",
    value: "dynamic",
  },
  {
    title: "Раскрыт",
    value: "full",
  },
  {
    title: "Минимал",
    value: "compact",
  },
];
