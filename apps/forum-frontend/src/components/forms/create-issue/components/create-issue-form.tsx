import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@repo/types/schemas/issue/create-issue-schema";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod"
import { createIssueAction } from "../hooks/use-create-issue";
import { Input } from "@repo/ui/src/components/input";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { HTMLAttributes } from "react";
import Mealing from "@repo/assets/images/mealing.jpg";
import { BlockWrapper } from "#components/wrappers/components/block-wrapper";
import { MessageSquareWarning } from "lucide-react";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea";
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

export const CreateIssueForm = reatomComponent(({ ctx }) => {
  const { formState: { errors, isValid }, control, setValue, reset, handleSubmit, getValues, watch } = useForm<IssueFormType>({
    resolver: zodResolver(createIssueSchema)
  });

  const onSubmit = async () => {
    const values = getValues()

    return createIssueAction(ctx, values).then(res => {
      if ("error" in res) {
        return
      }
      reset()
    })
  }

  const currentIssueType = watch("type")

  return (
    <div className="flex flex-col gap-y-6 w-full">
      <BlockWrapper className="flex xl:flex-row xl:justify-between flex-col gap-6 items-start !p-0 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-4 p-4 w-full xl:w-fit grow"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Typography className="text-[18px] font-medium">
              Название
            </Typography>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  variant="form"
                  className="rounded-md !p-4 text-[18px]"
                  placeholder="Кратко опишите проблему или идею"
                  status={errors ? "error" : "default"}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Typography className="text-[18px] font-medium">
              Описание
            </Typography>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <AutogrowingTextarea
                  className="border resize-none min-h-36 max-h-[1250px] border-transparent 
                  focus-visible:border-caribbean-green-200/40 bg-shark-900 rounded-md !p-4 text-[18px]"
                  placeholder="Расскажите подробнее о вашей проблеме или предложении"
                  autoComplete="off"
                  maxLength={ISSUE_MAX_DESCRIPTION_LIMIT}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Typography className="text-[18px] font-medium">
              Тип проблемы
            </Typography>
            <div className="flex items-center gap-2 w-full">
              {ISSUES_TYPES.map(({ title, type }) => (
                <Badge
                  key={type}
                  state={type === currentIssueType ? "active" : "default"}
                  onClick={() => setValue("type", type, { shouldValidate: true })}
                >
                  <Typography className="text-[18px] font-medium">
                    {title}
                  </Typography>
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="positive"
            disabled={ctx.spy(createIssueAction.statusesAtom).isPending || !isValid}
            pending={ctx.spy(createIssueAction.statusesAtom).isPending}
            className="max-w-44 w-full py-3 bg-[#088d47]/80 hover:bg-[#05b458]/80 self-end"
          >
            <Typography className="text-[18px] font-medium">
              Создать
            </Typography>
          </Button>
        </form>
        <div className="hidden xl:flex items-center w-[500px] h-full rounded-lg overflow-hidden">
          <img src={Mealing} alt="" width={500} height={500} draggable={false} className="w-full h-full" />
        </div>
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