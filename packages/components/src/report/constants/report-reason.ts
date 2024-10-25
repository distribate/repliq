import { ReportReason } from "../types/report-types.ts";

type ReportReasons = {
	title: string,
	type: ReportReason
}

export const REPORT_REASONS: ReportReasons[] = [
	{
		title: "Спам", type: "spam"
	},
	{
		title: "Оскорбления", type: "offensive"
	},
]