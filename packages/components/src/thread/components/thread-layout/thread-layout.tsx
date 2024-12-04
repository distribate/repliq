"use client";

import Link from "next/link";
import { useHistoryThreads } from "../saved-thread/hooks/use-history-threads.tsx";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { ReactNode } from "react";
import { ThreadModel } from "../../queries/get-thread-model.ts";

type ThreadLayout = {
  children: ReactNode;
} & Pick<ThreadModel, "id" | "owner" | "title">;

export const ThreadLayout = ({
  children,
  title,
  owner,
  id: threadId,
}: ThreadLayout) => {
  const { saveThread } = useHistoryThreads();

  const handleSaveThread = () => {
    return saveThread({ title, nickname: owner.nickname, threadId });
  };

  return (
    <Link href={THREAD_URL + threadId} onClick={handleSaveThread}>
      {children}
    </Link>
  );
};
