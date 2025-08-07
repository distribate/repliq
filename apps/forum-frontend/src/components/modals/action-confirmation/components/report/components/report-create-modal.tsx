import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  createReportAction,
} from "../models/create-report.model.ts";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import {
  reportAtom,
  reportDescriptionAtom,
  reportDialogIsOpenAtom,
  reportDialogTitleAtom,
  ReportItemProps,
  reportStageAtom,
  reportTypeAtom,
  updateReportValueAction,
} from "#components/modals/action-confirmation/components/report/models/report.model.ts";
import { Textarea } from "@repo/ui/src/components/textarea.tsx";
import { FlagTriangleLeft } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { ReactNode } from "react";

type ReportReasons = {
  title: string;
  type: "spam" | "offensive" | "dont-like";
};

export const REPORT_REASONS: ReportReasons[] = [
  { title: "Не нравится", type: "dont-like", },
  { title: "Спам", type: "spam", },
  { title: "Оскорбление", type: "offensive", },
];

const ReportReasonStage = reatomComponent(({ ctx }) => {
  const handleReason = (reason: "spam" | "offensive" | "dont-like") => {
    reportStageAtom(ctx, "description");
    reportAtom(ctx, (state) => ({ ...state, reason }))
  };

  return (
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
  )
}, "ReportReasonStage")

const ReportDescriptionStage = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <Textarea
        value={ctx.spy(reportDescriptionAtom) ?? ""}
        className="resize-y min-h-12 text-[15px] max-h-36 bg-shark-900 py-2"
        placeholder="Описание"
        onChange={e => reportDescriptionAtom(ctx, e.target.value)}
        maxLength={128}
      />
    </div>
  )
}, "ReportDescriptionStage")

const SyncType = ({ target }: { target: ReportItemProps["type"] }) => {
  useUpdate((ctx) => reportTypeAtom(ctx, target), [target])
  return null;
}

const STAGE_MAP: Record<string, ReactNode> = {
  "reason": <ReportReasonStage />,
  "description": <ReportDescriptionStage />
}

export const ReportCreateModal = reatomComponent<ReportItemProps>(({
  ctx, type, targetId, trigger
}) => {
  const updateReportValues = () => updateReportValueAction(ctx, { targetId })
  const createReport = () => {
    reportStageAtom(ctx, "description");
    createReportAction(ctx)
  }

  const stage = ctx.spy(reportStageAtom)

  const isPending = ctx.spy(createReportAction.statusesAtom).isPending

  return (
    <>
      <SyncType target={type} />
      <Dialog open={ctx.spy(reportDialogIsOpenAtom)} onOpenChange={v => reportDialogIsOpenAtom(ctx, v)}>
        <DialogTrigger>
          {trigger ? trigger :
            <HoverCardItem className="group gap-2" onClick={updateReportValues}>
              <FlagTriangleLeft size={16} className="text-red-500" />
              <Typography className="text-red-500" textSize="small">
                Пожаловаться
              </Typography>
            </HoverCardItem>
          }
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <ConfirmationActionModalTemplate title={ctx.spy(reportDialogTitleAtom)}>
            <div className="flex flex-col gap-y-4 w-full">
              {STAGE_MAP[stage]}
              <div className="flex items-center gap-2 w-full justify-end">
                {stage === "description" && (
                  <Button className="bg-shark-50" onClick={createReport} disabled={isPending}>
                    <Typography className="text-base text-shark-950 font-medium">
                      Отправить
                    </Typography>
                  </Button>
                )}
                <DialogClose>
                  <ConfirmationButton title="Отмена" actionType="cancel" disabled={isPending} />
                </DialogClose>
              </div>
            </div>
          </ConfirmationActionModalTemplate>
        </DialogContent>
      </Dialog>
    </>
  );
}, "ReportCreateModal")