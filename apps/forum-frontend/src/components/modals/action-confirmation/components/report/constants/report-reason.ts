import { ReportReasonEnum } from "@repo/types/entities/entities-type.ts";

type ReportReasons = {
  title: string;
  type: ReportReasonEnum;
};

export const REPORT_REASONS: ReportReasons[] = [
  { title: "Не нравится", type: "dont-like", },
  { title: "Спам", type: "spam", },
  { title: "Оскорбления", type: "offensive", },
];