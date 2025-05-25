import {
  ReportEntity,
  ReportReasonEnum,
} from "@repo/types/entities/entities-type.ts";
import { CreateReport } from "./create-report.model";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";

export type ReportQuery = {
  type: Pick<ReportEntity, "report_type">["report_type"];
  reportedItem: Pick<CreateReport, "targetId" | "targetContent" | "targetNickname"> | null;
  reason: ReportReasonEnum | null;
  description: string | null;
};

const initial: ReportQuery = {
  type: null,
  description: null,
  reason: null,
  reportedItem: null,
};

export const reportAtom = atom<ReportQuery>(initial, "report").pipe(withReset())