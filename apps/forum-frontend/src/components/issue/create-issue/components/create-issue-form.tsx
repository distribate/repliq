import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea";
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema";
import * as z from "zod"
import { createIssueAction, issueTypeAtom, isValidAtom, onChange } from "../models/create-issue.model";
import { Input } from "@repo/ui/src/components/input";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { HTMLAttributes } from "react";
import { BlockWrapper } from "#components/wrappers/components/block-wrapper";
import { MessageSquareWarning } from "lucide-react";
import { ISSUE_MAX_DESCRIPTION_LIMIT } from "@repo/shared/constants/limits";
import { reatomComponent } from "@reatom/npm-react";

type IssueFormType = z.infer<typeof createIssueSchema>;

type IssueType = {
  title: string,
  type: Pick<IssueFormType, "type">["type"]
}

const ISSUES_TYPES: IssueType[] = [
  { title: "🐛 Баг", type: "bug" },
  { title: "💡 Предложение", type: "suggestion" },
  { title: "🎮 Игра", type: "game" }
]

type BadgeProps = {
  children: React.ReactNode
  state: "active" | "default"
} & HTMLAttributes<HTMLDivElement>

const Badge = ({
  children, state, ...props
}: BadgeProps) => {
  return (
    <div
      className={`flex select-none items-center justify-center px-4 py-1 rounded-md cursor-pointer
    ${state === "active" ? "bg-shark-50 text-shark-900" : "bg-shark-800 text-shark-50"}`}
      {...props}
    >
      {children}
    </div>
  )
}

const IssueType = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <Typography className="text-[18px] font-medium">
        Тип проблемы
      </Typography>
      <div className="flex items-center gap-2 w-full">
        {ISSUES_TYPES.map(({ title, type }) => (
          <Badge
            key={type}
            state={type === ctx.spy(issueTypeAtom) ? "active" : "default"}
            onClick={() => issueTypeAtom(ctx, type)}
          >
            <Typography className="text-[18px] font-medium">
              {title}
            </Typography>
          </Badge>
        ))}
      </div>
    </div>
  )
}, "IssueType")

const IssueTitle = reatomComponent(({ ctx }) => {
  return (
    <Input
      variant="form"
      className="rounded-md !p-4 text-[18px]"
      onChange={e => onChange(ctx, e, "title")}
      placeholder="Кратко опишите проблему или идею"
      autoComplete="off"
    />
  )
}, "IssueTitle")

const IssueDesc = reatomComponent(({ ctx }) => {
  return (
    <AutogrowingTextarea
      className="border resize-none min-h-36 max-h-[1250px] border-transparent 
        focus-visible:border-caribbean-green-200/40 bg-shark-900 rounded-md !p-4 text-[18px]"
      placeholder="Расскажите подробнее о вашей проблеме или предложении"
      autoComplete="off"
      onChange={e => onChange(ctx, e, "desc")}
      maxLength={ISSUE_MAX_DESCRIPTION_LIMIT}
    />
  )
}, "IssueDesc")

const IssueSubmit = reatomComponent(({ ctx }) => {
  const isDisabled = ctx.spy(createIssueAction.statusesAtom).isPending || !ctx.spy(isValidAtom)

  return (
    <Button
      variant="positive"
      disabled={isDisabled}
      pending={ctx.spy(createIssueAction.statusesAtom).isPending}
      className="max-w-44 w-full py-3 bg-[#088d47]/80 hover:bg-[#05b458]/80 self-end"
    >
      <Typography className="text-[18px] font-medium">
        Создать
      </Typography>
    </Button>
  )
}, "IssueSubmit")

export const CreateIssueForm = reatomComponent(({ ctx }) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createIssueAction(ctx)
  }

  return (
    <div className="flex flex-col gap-y-6 w-full">
      <BlockWrapper className="flex xl:flex-row xl:justify-between flex-col gap-6 items-start !p-0 w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-start gap-4 p-4 w-full xl:w-fit grow"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Typography className="text-[18px] font-medium">
              Название
            </Typography>
            <IssueTitle />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Typography className="text-[18px] font-medium">
              Описание
            </Typography>
            <IssueDesc/>
          </div>
          <IssueType />
          <IssueSubmit />
        </form>
      </BlockWrapper>
      <BlockWrapper className="flex flex-col gap-2 !p-4 w-full">
        <div className="flex items-center select-none gap-2 w-fit">
          <Typography textSize="large" textColor="gray">
            Информация
          </Typography>
          <MessageSquareWarning size={18} className="text-shark-300" />
        </div>
        <div className="flex flex-col gap-1 h-full w-full">
          <Typography className="text-[18px]">
            {`>`} ваше сообщение будет обработано очень скоро...
          </Typography>
          <Typography className="text-[18px]">
            {`>`} если вы нашли баг, пожалуйста, сообщите нам об этом.
          </Typography>
          <Typography className="text-[18px]">
            {`>`} за каждый найденный подтвержденный баг или проблему вы получите сопоставимую награду.
          </Typography>
          <Typography className="text-[18px]">
            {`>`} сообщение можно создать только раз в сутки.
          </Typography>
        </div>
      </BlockWrapper>
    </div>
  )
}, "CreateIssueForm")