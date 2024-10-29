import { Typography } from '@repo/ui/src/components/typography.tsx';
import React from 'react';
import { ReportsReportType } from '@repo/shared/api/gen';
import { DynamicModal } from '../../../../dynamic-modal.tsx';
import { CREATE_REPORT_MUTATION_KEY, useCreateReport } from '../hooks/use-create-report.ts';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { REPORT_REASONS } from '../../../../../report/constants/report-reason.ts';
import { Button } from '@repo/ui/src/components/button.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { reportQuery } from '../../../../../report/queries/report-query.ts';
import {
  THREAD_COMMENTS_QUERY_KEY
} from '../../../../../thread/components/thread-comments/queries/thread-comments-query.ts';
import { ReportReason } from '../../../../../report/types/report-types.ts';
import { ReportEntity } from '@repo/types/entities/entities-type.ts';

type d = {
  id: string,
  content: string,
  user_nickname: string
}

export type ReportItemProps = {
  report_type: ReportsReportType,
  threadId: string,
  targetId: string
}

export const ReportCreateModal = ({
  report_type, threadId, targetId,
}: ReportItemProps) => {
  const qc = useQueryClient();
  const { data } = reportQuery(report_type);
  const { updateReportValuesMutation,	createReportMutation } = useCreateReport()
  
  const targets = qc.getQueryData<any[]>(
    THREAD_COMMENTS_QUERY_KEY(threadId)
  );
  
  const target: d[] | undefined = targets?.filter(
    item => item.id === targetId
  );
  
  const handleReason = (
    reason: ReportReason, type: Pick<ReportEntity, "report_type">["report_type"]
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
    <DynamicModal
      mutationKey={CREATE_REPORT_MUTATION_KEY}
      trigger={
        <Typography className="text-red-500 text-md cursor-pointer">
          Пожаловаться
        </Typography>
      }
      content={
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
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={updateReportValuesMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};