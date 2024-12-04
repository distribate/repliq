import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REPORT_QUERY_KEY, ReportQuery } from "#report/queries/report-query.ts";
import { postReport } from "#report/queries/post-report.ts";
import { toast } from "sonner";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const CREATE_REPORT_MUTATION_KEY = ["create-report"];

export const useCreateReport = () => {
  const qc = useQueryClient();
  const currentUser = getUser();

  const updateReportValuesMutation = useMutation({
    mutationFn: async (values: Partial<ReportQuery>) => {
      return qc.setQueryData(REPORT_QUERY_KEY, (prev: ReportQuery) => ({
        ...prev,
        ...values,
      }));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REPORT_QUERY_KEY }),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const createReportMutation = useMutation({
    mutationKey: CREATE_REPORT_MUTATION_KEY,
    mutationFn: async () => {
      const reportState = qc.getQueryData<ReportQuery>(REPORT_QUERY_KEY);

      if (!reportState || !currentUser) return;

      if (currentUser.nickname === reportState.reportedItem?.targetNickname) {
        return "self-reported";
      }

      const { reportedItem, type, reason, description } = reportState;

      if (!type || !reportedItem || !reason) return;

      const { targetNickname, targetId, targetContent } = reportedItem;

      return postReport({
        report_type: type,
        targetContent,
        targetId,
        targetNickname,
        reason,
        description: description ?? null,
      });
    },
    onSuccess: async (data) => {
      if (data === "self-reported")
        return toast.error("Вы не можете пожаловаться сами на себя!");
      if (!data) return toast.error("Произошла ошибка при создании репорта");

      toast.success("Заявка создана");

      return qc.resetQueries({ queryKey: REPORT_QUERY_KEY });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { updateReportValuesMutation, createReportMutation };
};
