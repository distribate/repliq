import { ThreadByCategoryItem } from "./components/thread-card-category/thread-by-category-item.tsx";
import { ThreadLayout } from "./components/thread-layout/thread-layout.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";

export const ThreadItem = ({
  created_at, description, id, properties, title, comments_count, views_count, owner
}: ThreadPreview) => {
  return (
    <ThreadLayout id={id} title={title} owner={owner}>
      <ThreadByCategoryItem
        created_at={created_at}
        description={description}
        id={id}
        properties={properties}
        title={title}
        comments_count={comments_count}
        views_count={views_count}
        owner={owner}
      />
    </ThreadLayout>
  );
};