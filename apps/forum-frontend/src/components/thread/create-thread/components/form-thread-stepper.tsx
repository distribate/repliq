import { threadFormStepAtom } from "../models/thread-form.model";
import { reatomComponent } from "@reatom/npm-react";

const STEPS: Record<string, string> = {
  "title": "Придумайте название",
  "category": "Выберите категорию",
  "content": "Расскажите что-то новое",
  "done": "Готово к публикации"
}

export const FormThreadStep = reatomComponent(({ ctx }) => {
  const data = ctx.spy(threadFormStepAtom)
  const currentStep = STEPS[data]

  return (
    <div
      data-state={data}
      className="flex items-center select-none justify-center border border-white/10 rounded-lg px-2 py-0.5
        data-[state=title]:bg-gradient-to-r data-[state=title]:from-green-500/50 data-[state=title]:from-10% data-[state=title]:via-transparent data-[state=title]:via-10% data-[state=title]:to-transparent
        data-[state=category]:bg-gradient-to-r data-[state=category]:from-green-500/50 data-[state=category]:from-30% data-[state=category]:via-transparent data-[state=category]:via-30% data-[state=category]:to-transparent
        data-[state=content]:bg-gradient-to-r data-[state=content]:from-green-500/50 data-[state=content]:from-60% data-[state=content]:via-transparent data-[state=content]:via-40% data-[state=content]:to-transparent
        data-[state=done]:bg-green-500/80
      "
    >
      <span className="text-sm text-shark-50">
        {currentStep}
      </span>
    </div>
  )
}, "FormThreadStep")