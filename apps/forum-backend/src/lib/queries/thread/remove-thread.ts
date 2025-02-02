import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import type { DB } from "@repo/types/db/forum-database-types.ts";
import type { Transaction } from "kysely";

async function removeThreadImages(id: string, trx: Transaction<DB>) {
  const threadImages = await trx
    .selectFrom("threads_images")
    .select("image_url")
    .where("thread_id", "=", id)
    .execute();

  if (threadImages) {
    threadImages.forEach(async (image) => {
      await supabase.storage.from("threads").remove([`/${image.image_url}`]);
    })
  }

  return await trx
    .deleteFrom("threads_images")
    .where("thread_id", "=", id)
    .returning("id")
    .executeTakeFirstOrThrow();
}

export const removeThread = async (id: string) => {
  return await forumDB.transaction().execute(async (trx) => {
    await removeThreadImages(id, trx);

    await trx
      .deleteFrom('threads_users')
      .where('thread_id', '=', id)
      .returning("thread_id")
      .executeTakeFirstOrThrow();

    await trx
      .deleteFrom('threads_reactions')
      .where('thread_id', '=', id)
      .returning("id")
      .executeTakeFirst();

    return await trx
      .deleteFrom('threads')
      .where('id', '=', id)
      .returning("id")
      .executeTakeFirstOrThrow();
  });
}