import { useQuery } from "@tanstack/react-query";
import {
  ReportEntity,
  ReportReasonEnum,
} from "@repo/types/entities/entities-type.ts";
import { PostReportItem } from "./post-report.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REPORT_QUERY_KEY = createQueryKey("ui", ["report"]);

export type ReportQuery = {
  type: Pick<ReportEntity, "report_type">["report_type"];
  reportedItem: PostReportItem | null;
  reason: ReportReasonEnum | null;
  description: string | null;
};

const initial: ReportQuery = {
  type: null,
  description: null,
  reason: null,
  reportedItem: null,
};

export const reportQuery = () =>
  useQuery<ReportQuery, Error>({
    queryKey: REPORT_QUERY_KEY,
    gcTime: Infinity,
    staleTime: Infinity,
    initialData: initial,
    refetchOnWindowFocus: false,
  });
