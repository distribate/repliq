import { forumDB } from "#shared/database/forum-db.ts";

export async function deleteFriendNote(note_id: string) {
  return await forumDB
  .deleteFrom('friends_notes')
  .where('id', '=', note_id)
  .execute();
}