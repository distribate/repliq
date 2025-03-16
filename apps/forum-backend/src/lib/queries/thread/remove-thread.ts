import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import type { DB } from "@repo/types/db/forum-database-types.ts";
import type { Transaction } from "kysely";

async function deleteComments(id: string, trx: Transaction<DB>) {
  const query = await trx
    .deleteFrom("comments")
    .where("parent_id", "=", id)
    .where("parent_type", "=", "thread")
    .executeTakeFirst()

  if (!query.numDeletedRows) {
    return false
  }

  return true;
}

async function removeThreadImages(id: string, trx: Transaction<DB>) {
  let finished: boolean = false;

  const threadImages = await trx
    .selectFrom("threads_images")
    .select("image_url")
    .where("thread_id", "=", id)
    .execute();

  if (threadImages && threadImages.length >= 1) {
    threadImages.forEach(async (image) => {
      await supabase.storage.from("threads").remove([`/${image.image_url}`]);
    })

    const result = await trx
      .deleteFrom("threads_images")
      .where("thread_id", "=", id)
      .executeTakeFirstOrThrow();

    if (result.numDeletedRows) {
      finished = true
    }

    finished = false
  } else {
    finished = true;
  }

  return finished
}

export const removeThread = async (id: string) => {
  const query = await forumDB.transaction().execute(async (trx) => {
    const removeImages = await removeThreadImages(id, trx);

    if (!removeImages) return;

    const removeComments = await deleteComments(id, trx)

    if (!removeComments) return;

    return trx
      .deleteFrom('threads')
      .where('id', '=', id)
      .returning("id")
      .executeTakeFirstOrThrow();
  });

  return query;
}