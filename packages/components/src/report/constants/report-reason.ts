import { ReportReason } from "../types/report-types.ts";

type ReportReasons = {
	title: string,
	type: ReportReason
}

export const REPORT_REASONS: ReportReasons[] = [
	{
		title: "Не нравится", type: "dont-like"
	},
	{
		title: "Спам", type: "spam"
	},
	{
		title: "Оскорбления", type: "offensive"
	},
]