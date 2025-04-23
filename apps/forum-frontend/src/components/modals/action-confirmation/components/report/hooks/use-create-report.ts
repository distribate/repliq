import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REPORT_QUERY_KEY, ReportQuery } from "#components/modals/action-confirmation/components/report/queries/report-query";
import { toast } from "sonner";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { ReportType } from "@repo/types/db/forum-database-types";
import { ReportReasonEnum } from "@repo/types/entities/entities-type";
import { forumReportClient } from "@repo/shared/api/forum-client";

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

  if ("error" in data) {
    return null
  }

  return data;
}

export const useCreateReport = () => {
  const qc = useQueryClient();
  const { nickname } = getUser();

  const updateReportValuesMutation = useMutation({
    mutationFn: async (values: Partial<ReportQuery>) => {
      return qc.setQueryData(REPORT_QUERY_KEY, (prev: ReportQuery) => ({
        ...prev, ...values,
      }));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REPORT_QUERY_KEY }),
    onError: e => {
      throw new Error(e.message);
    },
  });

  const createReportMutation = useMutation({
    mutationKey: CREATE_REPORT_MUTATION_KEY,
    mutationFn: async () => {
      const reportState = qc.getQueryData<ReportQuery>(REPORT_QUERY_KEY);

      if (!reportState) return;

      if (nickname === reportState.reportedItem?.targetNickname) {
        return "self-reported";
      }

      const { reportedItem, type: report_type, reason, description } = reportState;

      if (!report_type || !reportedItem || !reason) return;

      const { targetNickname, targetId, targetContent } = reportedItem;

      return createReport({ report_type, targetContent, targetId, targetNickname, reason, description: description ?? undefined });
    },
    onSuccess: async (data) => {
      if (data === "self-reported") {
        return toast.error("Вы не можете пожаловаться сами на себя!")
      }

      if (!data) {
        return toast.error("Произошла ошибка при создании репорта");
      }

      toast.success("Заявка создана");

      qc.resetQueries({ queryKey: REPORT_QUERY_KEY });
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  return { updateReportValuesMutation, createReportMutation };
};