import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal.tsx";
import {
  CREATE_REPORT_MUTATION_KEY,
  useCreateReport,
} from "../hooks/use-create-report.ts";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { REPORT_REASONS } from "#components/modals/action-confirmation/components/report/constants/report-reason.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { useQueryClient } from "@tanstack/react-query";
import {
  REPORT_QUERY_KEY,
  reportQuery,
} from "#components/modals/action-confirmation/components/report/queries/report-query.ts";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  THREAD_COMMENTS_QUERY_KEY,
  ThreadComment,
} from '#components/thread/thread-comments/queries/thread-comments-query.ts';
import { Textarea } from "@repo/ui/src/components/textarea.tsx";
import {
  ReportEntity,
  ReportReasonEnum,
} from "@repo/types/entities/entities-type.ts";
import { FlagTriangleLeft } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { GetUserPostsResponse } from "@repo/types/routes-types/get-user-posts-types.ts";

export type ReportItemProps = {
  reportType: Pick<ReportEntity, "report_type">["report_type"];
  targetNickname: string;
  threadId?: string;
  targetId?: string | number;
  customTrigger?: React.ReactNode;
};

const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', ['posts'], nickname);

export const ReportCreateModal = ({
  reportType, targetId, targetNickname, threadId, customTrigger
}: ReportItemProps) => {
  const qc = useQueryClient();
  const [stage, setStage] = useState<"reason" | "description">("reason");
  const { data: reportState } = reportQuery();
  const { updateReportValuesMutation, createReportMutation } = useCreateReport();

  const updateReportValues = () => {
    let id: string | number | null = null;
    let content: string | null = null;

    if (reportType === "post") {
      const selectedPosts = qc.getQueryData<GetUserPostsResponse | null>(
        POSTS_QUERY_KEY(targetNickname),
      );

      const selectedPost = selectedPosts?.data?.find(p => p.id === targetId);

      if (!selectedPost) {
        return toast.error("Target it must be a provided");
      }

      id = selectedPost.id;
      content = selectedPost.content;
    } else if (reportType === "comment" && threadId) {
      const selectedComments = qc.getQueryData<ThreadComment[]>(THREAD_COMMENTS_QUERY_KEY(threadId));
      const selectedComment = selectedComments?.find(c => c.id === targetId,);

      if (!selectedComment) {
        return toast.error("Target it must be a provided");
      }

      id = selectedComment.id;
      content = selectedComment.content;
    } else if (reportType === "account") {
      id = targetNickname;
    }

    if (!id) return;

    setStage("reason");

    return updateReportValuesMutation.mutate({
      type: reportType,
      reportedItem: {
        targetNickname: targetNickname,
        targetId: id,
        targetContent: content ?? "",
      },
    });
  };

  const handleReason = (reason: ReportReasonEnum) => {
    setStage("description");
    updateReportValuesMutation.mutate({ reason });
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    updateReportValuesMutation.mutate({ description: e.target.value });

  const createReport = () => {
    setStage("reason");
    return createReportMutation.mutate();
  };

  const onClose = () => {
    setStage("reason");
    return qc.resetQueries({ queryKey: REPORT_QUERY_KEY });
  };

  const dialogTitle =
    stage === "reason"
      ? "Укажите причину нарушения"
      : stage === "description"
        ? "Укажите описание нарушения"
        : "";

  return (
    <DynamicModal
      withLoader
      contentClassName="max-w-md"
      mutationKey={CREATE_REPORT_MUTATION_KEY}
      trigger={
        customTrigger ? customTrigger :
          <HoverCardItem className="group gap-2" onClick={updateReportValues}>
            <FlagTriangleLeft size={16} className="text-red-500" />
            <Typography className="text-red-500" textSize="small">
              Пожаловаться
            </Typography>
          </HoverCardItem>
      }
      content={
        <ConfirmationActionModalTemplate title={dialogTitle}>
          <div className="flex flex-col gap-y-4 w-full">
            {stage === "reason" && (
              <div className="flex flex-col w-full gap-2">
                {REPORT_REASONS.map((reason, i) => (
                  <Button
                    key={i}
                    onClick={() => handleReason(reason.type)}
                    state="default"
                    className="w-full justify-start"
                  >
                    <Typography textSize="medium">{reason.title}</Typography>
                    <Typography
                      textSize="medium"
                      className="self-end"
                    >{`>`}</Typography>
                  </Button>
                ))}
              </div>
            )}
            {stage === "description" && (
              <div className="flex flex-col gap-y-2 w-full">
                <Textarea
                  value={reportState.description || ""}
                  className="resize-y min-h-12 text-[15px] max-h-36 bg-shark-900 py-2"
                  placeholder="Описание"
                  onChange={onChange}
                  maxLength={128}
                />
              </div>
            )}
            <div className="flex items-center gap-2 w-full justify-end">
              {stage === "description" && (
                <Button
                  variant="positive"
                  onClick={createReport}
                  disabled={createReportMutation.isPending}
                >
                  <Typography className="text-base font-medium">
                    Отправить
                  </Typography>
                </Button>
              )}
              <DialogClose onClick={onClose}>
                <ConfirmationButton
                  title="Отмена"
                  actionType="cancel"
                  disabled={createReportMutation.isPending}
                />
              </DialogClose>
            </div>
          </div>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};