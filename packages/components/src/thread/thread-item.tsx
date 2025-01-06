import { ThreadByCategoryItem } from "./components/thread-card-category/thread-by-category-item.tsx";
import { ThreadLayout } from "./components/thread-layout/thread-layout.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";

export const ThreadItem = ({
  created_at, description, id, is_comments, title, thread_comments_count, thread_views_count, owner
}: ThreadPreview) => {
  return (
    <ThreadLayout id={id} title={title} owner={owner}>
      <ThreadByCategoryItem
        created_at={created_at}
        description={description}
        id={id}
        is_comments={is_comments}
        title={title}
        thread_comments_count={thread_comments_count}
        thread_views_count={thread_views_count}
        owner={owner}
      />
    </ThreadLayout>
  );
};