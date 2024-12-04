import { ThreadEntity } from "@repo/types/entities/entities-type.ts";

type ThreadsListByCategoryProps = {
  threadsList: ThreadEntity[] | null;
};

export const ThreadsListByCategory = ({
  threadsList,
}: ThreadsListByCategoryProps) => {
  if (!threadsList) return null;
};
