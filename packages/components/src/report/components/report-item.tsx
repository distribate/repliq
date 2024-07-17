import { DialogWrapper } from "../../wrappers/dialog-wrapper.tsx";
import { ReportModal } from "../../modals/action-confirmation/components/report/components/report-modal.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { REPORT } from "@repo/types/entities/entities-type.ts"
import React from "react";

export type ReportItemProps = {
	targetId: string,
	threadId: string
} & Pick<REPORT, "report_type">

export const ReportItem = ({
	targetId, report_type, threadId
}: ReportItemProps) => {
	
	console.log(targetId)
	
	return (
		<DialogWrapper
			name="report-create"
			trigger={(
				<Typography className="text-red-500 text-md cursor-pointer">
					Пожаловаться
				</Typography>
			)}
		>
			<ReportModal targetId={targetId} threadId={threadId} report_type={report_type}/>
		</DialogWrapper>
	)
}