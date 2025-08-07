import * as z from "zod";

export const createAuthImageSchema = z.object({
  files: z
    .array(
      z.instanceof(File)
    )
    .min(1).max(3),
})