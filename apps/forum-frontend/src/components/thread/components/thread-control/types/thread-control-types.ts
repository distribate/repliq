import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";

export type ThreadControlFields = Pick<
  ThreadDetailed,
  "title" | "id" | "description" | "content" | "properties"
>;
