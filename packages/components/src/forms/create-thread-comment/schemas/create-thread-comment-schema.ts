import { COMMENT_LIMIT } from "@repo/shared/constants/limits";
import { z } from "zod";

export const createThreadCommentSchema = z.object({
  content: z
    .string()
    .min(COMMENT_LIMIT[0], `Content must be at least ${COMMENT_LIMIT[0]} characters long`)
    .max(COMMENT_LIMIT[1], `Content must be less than ${COMMENT_LIMIT[1]} characters long`)
    .refine(content => {
      const emptyLines = content.split('\n').filter(line => line.trim() === '').length;
      const tripleSpaces = content.split('   ').length - 1; 

      return emptyLines <= 2 && tripleSpaces <= 3;
    }, {
      message: 'Cannot have more than two empty lines or more than three consecutive spaces',
    }),
})