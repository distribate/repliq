"use client";

import Link from "next/link";
import { useHistoryThreads } from "../saved-thread/hooks/use-history-threads.tsx";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { ReactNode } from "react";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";

type ThreadLayout = {
  children: ReactNode;
} & Pick<ThreadDetailed, "id" | "owner" | "title">;

export const ThreadLayout = ({
  children, title, owner, id: threadId,
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