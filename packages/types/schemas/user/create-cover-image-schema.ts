import { z } from "zod/v4";

export const createCoverImageSchema = z.object({
  type: z.enum(["custom", "default"]),
  fileName: z.string().optional(),
  file: z.instanceof(Uint8Array).optional(),
}).check((ctx) => {
  if (ctx.value.type === "custom" && !ctx.value.file) {
    ctx.issues.push({
      input: "",
      code: "custom",
      path: ["file"],
      message: "File is required",
    });
  }

  if (ctx.value.type === "default" && !ctx.value.fileName) {
    ctx.issues.push({
      input: "",
      code: "custom",
      path: ["fileName"],
      message: "Filename is required",
    });
  }
})