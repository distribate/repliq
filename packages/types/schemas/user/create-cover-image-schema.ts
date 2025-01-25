import { z } from "zod";

export const createCoverImageSchema = z.object({
  type: z.enum(["custom", "default"]),
  file: z.custom<File>().nullable(),
}).superRefine((data, ctx) => {
  if (data.type === "custom" && !data.file) {
    ctx.addIssue({
      code: "custom",
      path: ["file"],
      message: "File is required",
    });
  }
});