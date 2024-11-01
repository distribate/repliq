import { useQuery } from "@tanstack/react-query";
import { ReportEntity } from "@repo/types/entities/entities-type.ts"
import { PostReportItem } from "./post-report.ts";
import { ReportReason } from "../types/report-types.ts";

export const REPORT_QUERY_KEY = [ "ui", "report" ]

export type ReportQuery = Partial<{
	type: Pick<ReportEntity, "report_type">["report_type"],
	reportedItem: PostReportItem,
	reason: ReportReason,
	description?: string
}>

const initial: ReportQuery = {
	type: null
}

export const reportQuery = () => {
	return useQuery<ReportQuery, Error>({
		queryKey: REPORT_QUERY_KEY,
		gcTime: Infinity,
		staleTime: Infinity,
		initialData: initial,
		refetchOnWindowFocus: false
	})
}