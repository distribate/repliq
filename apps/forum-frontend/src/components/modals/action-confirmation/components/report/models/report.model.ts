import {
  ReportEntity,
  ReportReasonEnum,
} from "@repo/types/entities/entities-type.ts";
import { CreateReport } from "./create-report.model";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";

type Report = {
  type: Pick<ReportEntity, "report_type">["report_type"];
  reportedItem: Pick<CreateReport, "targetId" | "targetContent" | "targetNickname"> | null;
  reason: ReportReasonEnum | null;
  description: string | null;
};

const initial: Report = {
  type: null,
  description: null,
  reason: null,
  reportedItem: null,
};

export const reportAtom = atom<Report>(initial, "report").pipe(withReset())