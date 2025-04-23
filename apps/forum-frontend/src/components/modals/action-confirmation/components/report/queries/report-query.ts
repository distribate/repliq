import { useQuery } from "@tanstack/react-query";
import {
  ReportEntity,
  ReportReasonEnum,
} from "@repo/types/entities/entities-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { CreateReport } from "../hooks/use-create-report";

export const REPORT_QUERY_KEY = createQueryKey("ui", ["report"]);

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

export const reportQuery = () => useQuery<ReportQuery, Error>({
  queryKey: REPORT_QUERY_KEY,
  gcTime: Infinity,
  staleTime: Infinity,
  initialData: initial,
  refetchOnWindowFocus: false,
});