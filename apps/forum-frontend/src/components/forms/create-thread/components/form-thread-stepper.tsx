import { serializeNodes } from "@repo/lib/helpers/nodes-serializer";
import { ThreadFormQuery, threadFormQuery } from "../queries/thread-form-query";

type Step = "title" | "category" | "content" | "done"

const STEPS: Record<Step, string> = {
  "title": "Придумайте название",
  "category": "Выберите категорию",
  "content": "Расскажите что-то новое",
  "done": "Готово к публикации"
}

const getCurrentStep = (data: ThreadFormQuery): Step => {
  if (!data.title || data.title.trim() === "") {
    return "title";
  }
  
  if (data.category_id === null) {
    return "category";
  }

  const stringContent = serializeNodes(data.content)

  if (!data.content || stringContent.trim() === "") {
    return "content";
  }

  return "done";
};

export const FormThreadStep = () => {
  const data = threadFormQuery().data
  const currentStep = getCurrentStep(data)
  
  return (
    <div className="flex items-center select-none justify-center border border-shark-500 rounded-lg px-2 py-0.5">
      <span className="text-sm text-shark-50">
        {STEPS[currentStep]}
      </span>
    </div>
  )
}