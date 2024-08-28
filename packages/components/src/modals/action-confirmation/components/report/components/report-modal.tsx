import { Button } from "@repo/ui/src/components/button.tsx";
import { useCreateReport } from "../hooks/use-create-report.ts";
import { REPORT_REASONS } from "../../../../../report/constants/report-reason.ts";
import { REPORT } from "@repo/types/entities/entities-type.ts"
import { ReportReason } from "../../../../../report/types/report-types.ts";
import { reportQuery } from "../../../../../report/queries/report-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
	THREAD_COMMENTS_QUERY_KEY
} from '../../../../../thread/components/thread-comments/queries/thread-comments-query.ts';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { ConfirmationActionModalTemplate } from "@repo/components/src/templates/confirmation-action-modal-template.tsx"
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { REPOST_CREATE_MODAL_NAME } from './report-create-modal.tsx';

type d = {
	id: string,
	content: string,
	user_nickname: string
}

type ReportModal = {
	report_type: Pick<REPORT, "report_type">["report_type"],
	targetId: string,
	threadId: string
}

export const ReportModal = ({
	report_type, targetId, threadId
}: ReportModal) => {
	const qc = useQueryClient();
	const { data } = reportQuery(report_type);
	const { removeDialogMutation } = useDialog()
	const { updateReportValuesMutation,	createReportMutation } = useCreateReport()
	
	const targets = qc.getQueryData<any[]>(
		THREAD_COMMENTS_QUERY_KEY(threadId)
	);
	
	const target: d[] | undefined = targets?.filter(
		item => item.id === targetId
	);
	
	const handleReason = (
		reason: ReportReason, type: Pick<REPORT, "report_type">["report_type"]
	) => {
		console.log(target);
		
		if (!target) return;
		
		updateReportValuesMutation.mutate({
			type, reason,
			reportedItem: {
				target_id: target[0].id,
				target_content: target[0].content,
				target_nickname: target[0].user_nickname
			}
		})
	}
	
	return (
		<ConfirmationActionModalTemplate title="Укажите причину">
			{REPORT_REASONS.map((reason, i) => (
				<Button
					onClick={() => handleReason(reason.type, report_type)}
					key={i}
					disabled={updateReportValuesMutation.isPending}
					variant="default"
				>
					{reason.title}
				</Button>
			))}
			<ConfirmationButton
				title="Отмена"
				actionType="cancel"
				disabled={updateReportValuesMutation.isPending}
				onClick={() => {
					removeDialogMutation.mutate(REPOST_CREATE_MODAL_NAME)
				}}
			/>
		</ConfirmationActionModalTemplate>
	)
}