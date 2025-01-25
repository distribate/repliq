"use client";

import { Link } from "@tanstack/react-router";
import { useHistoryThreads } from "../saved-thread/hooks/use-history-threads.tsx";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { ReactNode } from "react";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";

type ThreadLayout = {
  children: ReactNode;
} & Pick<ThreadDetailed, "id" | "owner" | "title">;

export const ThreadLayout = ({
  children, title, owner, id
}: ThreadLayout) => {
  const { saveThread } = useHistoryThreads();
  const { nickname } = owner;

  return (
    <Link
      to={THREAD_URL + id}
      onClick={() => saveThread({ thread: { title, owner: nickname, id } })}
    >
      {children}
    </Link>
  );
};