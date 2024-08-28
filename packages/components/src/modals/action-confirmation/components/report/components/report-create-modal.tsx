import { Typography } from '@repo/ui/src/components/typography.tsx';
import React from 'react';
import { ReportsReportType } from '@repo/shared/api/gen';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { ReportModal } from './report-modal.tsx';

export const REPOST_CREATE_MODAL_NAME = "report-create"

export type ReportItemProps = {
  report_type: ReportsReportType,
  threadId: string,
  targetId: string
}

export const ReportCreateModal = ({
  report_type, threadId, targetId
}: ReportItemProps) => {
  
  console.log(targetId)
  
  return (
    <DialogWrapper
      name={REPOST_CREATE_MODAL_NAME}
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