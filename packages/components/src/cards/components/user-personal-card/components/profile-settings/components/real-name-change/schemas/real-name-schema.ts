import { z } from "zod";

export const realNameSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Слишком короткое имя!",
    })
    .max(24, {
      message: "Слишком длинное имя!",
    }),
});
