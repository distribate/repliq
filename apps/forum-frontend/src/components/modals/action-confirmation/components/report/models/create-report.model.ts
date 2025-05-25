import { reportAtom } from "#components/modals/action-confirmation/components/report/models/report.model";
import { toast } from "sonner";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import { ReportType } from "@repo/types/db/forum-database-types";
import { ReportReasonEnum } from "@repo/types/entities/entities-type";
import { forumReportClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";

export const CREATE_REPORT_MUTATION_KEY = ["create-report"];

export type CreateReport = {
  report_type: ReportType;
  reason: ReportReasonEnum;
  description?: string
} & {
  targetId: string | number;
  targetNickname: string;
  targetContent: string
};

async function createReport({
  reason, report_type, targetContent, targetId, targetNickname, description,
}: CreateReport) {
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

  if ("error" in data) return null

  return data;
}

export const createReportAction = reatomAsync(async (ctx) => {
  const reportState = ctx.get(reportAtom)
  const nickname = ctx.get(currentUserNicknameAtom)

  if (!reportState || !nickname) return;

  if (nickname === reportState.reportedItem?.targetNickname) {
    return "self-reported";
  }

  const { reportedItem, type: report_type, reason, description } = reportState;

  if (!report_type || !reportedItem || !reason) return;

  const { targetNickname, targetId, targetContent } = reportedItem;

  return await createReport({ report_type, targetContent, targetId, targetNickname, reason, description: description ?? undefined });
}, {
  name: "createReportAction",
  onFulfill: (ctx, res) => {
    if (res === "self-reported") {
      return toast.error("Вы не можете пожаловаться сами на себя!")
    }

    if (!res) {
      return toast.error("Произошла ошибка при создании репорта");
    }

    toast.success("Заявка создана");

    reportAtom.reset(ctx)
  }
}).pipe(withStatusesAtom())