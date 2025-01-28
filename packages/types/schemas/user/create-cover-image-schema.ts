import { z } from "zod";

export const createCoverImageSchema = z.object({
  type: z.enum(["custom", "default"]),
  fileName: z.string().optional(),
  file: z.instanceof(Uint8Array).optional(),
}).superRefine((data, ctx) => {
  if (data.type === "custom" && !data.file) {
    ctx.addIssue({
      code: "custom",
      path: ["file"],
      message: "File is required",
    });
  }

  if (data.type === "default" && !data.fileName) {
    ctx.addIssue({
      code: "custom",
      path: ["fileName"],
      message: "Filename is required",
    });
  }
})