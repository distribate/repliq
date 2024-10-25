import { useQuery } from "@tanstack/react-query";
import { ReportEntity } from "@repo/types/entities/entities-type.ts"
import { PostReportItem } from "./post-report.ts";
import { ReportReason } from "../types/report-types.ts";

export const REPORT_QUERY_KEY = (
	type: Pick<ReportEntity, "report_type">["report_type"]
) => [ "ui", "report", type ]

export type ReportQuery = Partial<{
	type: Pick<ReportEntity, "report_type">["report_type"],
	reportedItem: PostReportItem,
	reason: ReportReason
}>

export const reportQuery = (
	type: Pick<ReportEntity, "report_type">["report_type"]
) => {
	return useQuery<ReportQuery, Error>({
		queryKey: REPORT_QUERY_KEY(type),
		gcTime: Infinity,
		staleTime: Infinity,
		refetchOnWindowFocus: false
	})
}