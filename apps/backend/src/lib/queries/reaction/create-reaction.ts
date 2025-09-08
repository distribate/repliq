import { getUserDonate } from "#lib/queries/user/get-user-donate.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { REACTIONS_LIMIT_DEFAULT, REACTIONS_LIMIT_PREMIUM } from "@repo/shared/constants/routes";
import * as z from 'zod';

type ReactionType = "thread" | "post"

type Opts = { id: string, emoji: string }

export const createReactionRouteSchema = z.object({
  emoji: z.string()
})

const TABLES = {
  "thread": {
    table: "threads_reactions",
    column: "thread_id"
  },
  "post": {
    table: "posts_reactions",
    column: "post_id"
  }
} as const;

async function validateReactionLimit(
  nickname: string
): Promise<typeof REACTIONS_LIMIT_PREMIUM | typeof REACTIONS_LIMIT_DEFAULT> {
  const isDonate = await getUserDonate(nickname)
  const hasAccess = isDonate === true;
  const limit = hasAccess ? REACTIONS_LIMIT_PREMIUM : REACTIONS_LIMIT_DEFAULT
  return limit
}

async function getReactionCount(
  nickname: string,
  { id, type }: { id: string, type: ReactionType }
): Promise<number> {
  const target = TABLES[type];

  const query = await forumDB
    .selectFrom(target.table)
    .select(forumDB.fn.countAll().as('count'))
    .where(target.column, "=", id)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  return Number(query.count)
}

type CreateReactionStatus =
  | "created"
  | "created-and-removed"
  | "deleted"

type CreateReactionPayloadItem = {
  emoji: string,
  id: string
}

type CreateReactionPayload = {
  status: CreateReactionStatus,
  updatedTo: CreateReactionPayloadItem | null,
  removedTo: CreateReactionPayloadItem | null
}

export async function createReaction(
  nickname: string,
  type: ReactionType,
  { id, emoji }: Opts
): Promise<CreateReactionPayload> {
  const userReactionCount = await getReactionCount(nickname, { id, type });
  const limit = await validateReactionLimit(nickname);
  const target = TABLES[type]

  return forumDB.transaction().execute(async (trx) => {
    async function create() {
      return trx
        .insertInto(target.table)
        // @ts-expect-error
        .values({
          [target.column]: id, nickname, emoji
        })
        .returning(["id", "emoji"])
        .executeTakeFirst()
    }

    const existingReaction = await trx
      .selectFrom(target.table)
      .select(["id", "emoji"])
      .where(target.column, "=", id)
      .where("nickname", "=", nickname)
      .orderBy("created_at", "asc")
      .execute();

    const isExists = existingReaction.some(exist => exist.emoji === emoji)

    if (isExists) {
      const deleted = await trx
        .deleteFrom(target.table)
        .where(target.column, "=", id)
        .where("nickname", "=", nickname)
        .where("emoji", "=", emoji)
        .returning(["id", "emoji"])
        .executeTakeFirst();

      return {
        status: "deleted" as CreateReactionStatus,
        updatedTo: null,
        removedTo: deleted ?? null
      };
    }

    let removedTo: CreateReactionPayloadItem | null = null;

    if (userReactionCount >= limit) {
      const oldestReaction = existingReaction[0];

      if (oldestReaction) {
        const deleted = await trx
          .deleteFrom(target.table)
          .where("id", "=", oldestReaction.id)
          .returning(["id", "emoji"])
          .executeTakeFirst();

        if (deleted) {
          removedTo = deleted;
        }
      }
    }

    const createdTo = await create();

    if (createdTo && createdTo.id) {
      return {
        status: removedTo ? "created-and-removed" : "created",
        updatedTo: createdTo,
        removedTo
      };
    }

    throw new Error("Failed to create reaction");
  })
}