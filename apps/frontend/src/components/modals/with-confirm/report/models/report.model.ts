import { CreateReport } from "./create-report.model";
import { action, atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { postsDataAtom } from "#components/profile/posts/models/posts.model";
import { threadCommentsDataAtom } from "#components/thread/components/thread-comments/models/thread-comments.model";
import { toast } from "sonner";

type ReportType = Pick<any, "report_type">["report_type"]

type Report = {
  type: ReportType;
  reportedItem: Pick<CreateReport, "targetId" | "targetContent" | "targetNickname"> | null;
  reason: any | null;
};

export type ReportItemProps = {
  type: ReportType;
  // must be postId || commentId || userNickname || threadId
  targetId: string;
  trigger?: React.ReactNode;
};

const STAGE_TITLE_MAP: Record<string, string> = {
  "reason": "Укажите причину нарушения",
  "description": "Укажите описание нарушения"
}

const initial: Report = {
  type: null,
  reason: null,
  reportedItem: null,
};

export const reportAtom = atom<Report>(initial, "report").pipe(withReset())
export const reportDescriptionAtom = atom<string | null>(null, "reportDescription").pipe(withReset())

export const reportStageAtom = atom<"reason" | "description">("reason", "stage")
export const reportTypeAtom = atom<ReportItemProps["type"] | null>(null, "reportType")
export const reportDialogIsOpenAtom = atom(false, "dialogIsOpen")

reportDialogIsOpenAtom.onChange((ctx, state) => {
  if (state === false) {
    reportStageAtom(ctx, "reason");
    reportAtom.reset(ctx)
  }
})

export const reportDialogTitleAtom = atom((ctx) => {
  const stage = ctx.spy(reportStageAtom)
  return STAGE_TITLE_MAP[stage]
}, "dialogTitle")

export const updateReportValueAction = action((ctx, values: Pick<ReportItemProps, "targetId">) => {
  const type = ctx.get(reportTypeAtom)
  if (!type) return;

  let id: string | number | null = null;
  let content: string | null = null;

  if (type === "post") {
    const { targetId: postId } = values

    const selectedPosts = ctx.get(postsDataAtom)
    const selectedPost = selectedPosts?.find(p => p.id === postId);

    if (!selectedPost) return toast.error("Target it must be a provided");

    id = selectedPost.id;
    content = selectedPost.content;
  }

  if (type === "comment") {
    const { targetId: commentId } = values

    const threadComments = ctx.get(threadCommentsDataAtom)
    const selectedComment = threadComments?.find(c => c.id === Number(commentId));

    if (!selectedComment) return toast.error("Target it must be a provided");

    id = selectedComment.id;
    content = selectedComment.content;
  }

  if (type === "account") {
    const { targetId: nickname } = values
    id = nickname;
  }

  if (!id) return;

  reportStageAtom(ctx, "reason");

  const { targetId: nickname } = values

  reportAtom(ctx, (state) => ({
    ...state,
    type,
    reportedItem: {
      targetNickname: nickname,
      targetId: id,
      targetContent: content ?? "",
    },
  }))
})