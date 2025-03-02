import { ReportReasonEnum } from "@repo/types/entities/entities-type";
import { forumReportClient } from "@repo/shared/api/forum-client";
import { ReportType } from "@repo/types/db/forum-database-types";

type PostReportType = {
  report_type: ReportType;
  reason: ReportReasonEnum;
  description?: string
} & PostReportItem;

export type PostReportItem = {
  targetId: string | number;
  targetNickname: string;
  targetContent: string
};

export async function createReport({
  reason, report_type, targetContent, targetId, targetNickname, description,
}: PostReportType) {
  const reported_item = {
    targetId,
    targetContent,
    targetNickname,
  };

  const res = await forumReportClient.report["create-report"].$post({
    json: {
      reason,
      report_type,
      reported_item: JSON.stringify(reported_item),
      target_user_nickname: targetNickname,
      description,
    }
  });

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}