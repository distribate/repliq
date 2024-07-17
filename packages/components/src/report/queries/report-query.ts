import { useQuery } from "@tanstack/react-query";
import { REPORT } from "@repo/types/entities/entities-type.ts"
import { PostReportItem } from "./post-report.ts";
import { ReportReason } from "../types/report-types.ts";

export const REPORT_QUERY_KEY = (
	type: Pick<REPORT, "report_type">["report_type"]
) => [ "ui", "report", type ]

export type ReportQuery = Partial<{
	type: Pick<REPORT, "report_type">["report_type"],
	reportedItem: PostReportItem,
	reason: ReportReason
}>

const initial: ReportQuery = {
	reason: "spam"
}

export const reportQuery = (
	type: Pick<REPORT, "report_type">["report_type"]
) => {
	return useQuery<ReportQuery, Error>({
		queryKey: REPORT_QUERY_KEY(type),
		gcTime: Infinity,
		staleTime: Infinity,
		refetchOnWindowFocus: false
	})
}