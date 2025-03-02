import { forumDB } from "../../shared/database/forum-db";

type UpdateSessionExpire = {
  expires_at: Date,
  session_id: string
}

export const updateSessionExpires = async ({
  expires_at, session_id
}: UpdateSessionExpire) => {
  return await forumDB
    .updateTable("users_session")
    .set({ expires_at: expires_at })
    .where("session_id", "=", session_id)
    .execute();
}