import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal.tsx";
import {
  createReportAction,
} from "../models/create-report.model.ts";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import {
  reportAtom,
} from "#components/modals/action-confirmation/components/report/models/report.model.ts";
import React, { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@repo/ui/src/components/textarea.tsx";
import {
  ReportEntity,
} from "@repo/types/entities/entities-type.ts";
import { FlagTriangleLeft } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { threadCommentsDataAtom } from "#components/thread/thread-comments/models/thread-comments.model.ts";
import { postsDataAtom } from "#components/profile/posts/posts/models/posts.model.ts";
import { ReportReasonEnum } from "@repo/types/entities/entities-type.ts";

type ReportReasons = {
  title: string;
  type: ReportReasonEnum;
};

export const REPORT_REASONS: ReportReasons[] = [
  { title: "Не нравится", type: "dont-like", },
  { title: "Спам", type: "spam", },
  { title: "Оскорбления", type: "offensive", },
];

export type ReportItemProps = {
  reportType: Pick<ReportEntity, "report_type">["report_type"];
  targetNickname: string;
  threadId?: string;
  targetId?: string | number;
  customTrigger?: React.ReactNode;
};

export const ReportCreateModal = reatomComponent<ReportItemProps>(({
  ctx, reportType, targetId, targetNickname, threadId, customTrigger
}) => {
  const [stage, setStage] = useState<"reason" | "description">("reason");
  const reportState = ctx.spy(reportAtom)
  const threadComments = ctx.spy(threadCommentsDataAtom)
  
  const updateReportValues = () => {
    let id: string | number | null = null;
    let content: string | null = null;

    if (reportType === "post") {
      const selectedPosts = ctx.get(postsDataAtom)

      const selectedPost = selectedPosts?.find(p => p.id === targetId);

      if (!selectedPost) {
        return toast.error("Target it must be a provided");
      }

      id = selectedPost.id;
      content = selectedPost.content;
    } else if (reportType === "comment" && threadId) {
      const selectedComments = threadComments
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

    reportAtom(ctx, (state) => ({
      ...state, type: reportType,
      reportedItem: {
        targetNickname: targetNickname,
        targetId: id,
        targetContent: content ?? "",
      },
    }))
  };

  const handleReason = (reason: ReportReasonEnum) => {
    setStage("description");
    reportAtom(ctx, (state) => ({ ...state, reason }))
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    reportAtom(ctx, (state) => ({ ...state, description: e.target.value }))

  const createReport = () => {
    setStage("reason");
    createReportAction(ctx)
  };

  const onClose = () => {
    setStage("reason");
    reportAtom.reset(ctx)
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
      isPending={ctx.spy(createReportAction.statusesAtom).isPending}
      contentClassName="max-w-md"
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
                  disabled={ctx.spy(createReportAction.statusesAtom).isPending}
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
                  disabled={ctx.spy(createReportAction.statusesAtom).isPending}
                />
              </DialogClose>
            </div>
          </div>
        </ConfirmationActionModalTemplate>
      }
    />
  );
}, "ReportCreateModal")