import { z } from "zod/v4";
import { ISSUE_MAX_DESCRIPTION_LIMIT } from "../../../shared/constants/limits.ts";

export const createIssueSchema = z.object({
  title: z.string().min(4, {
    message: "Заголовок слишком короткий",
  }).max(256),
  description: z.string().min(4, {
    message: "Описание слишком короткое",
  }).max(ISSUE_MAX_DESCRIPTION_LIMIT),
  type: z.enum(["bug", "suggestion", "game"], {
    message: "Тип сообщения обязателен"
  })
})