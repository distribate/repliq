"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useCreateThreadComment } from "../hooks/use-create-thread-comment.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { createThreadCommentQuery } from "../queries/create-thread-comment-query.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { CreateThreadCommentFormLayout } from "./create-thread-comment-form-layout.tsx";
import { useParams } from "next/navigation";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { COMMENT_LIMIT } from "@repo/shared/constants/limits.ts";

type CreateThreadCommentParams = { id: string };
type CreateThreadCommentFormError = "max-limit" | null;

export const CreateThreadCommentForm = () => {
  const currentUser = getUser();
  const params = useParams<CreateThreadCommentParams>();
  if (!params.id || !currentUser) return null;

  const [error, setError] = useState<CreateThreadCommentFormError>(null);
  const { data: createThreadCommentState } = createThreadCommentQuery();
  const { updateCreateThreadCommentMutation, createThreadCommentMutation } =
    useCreateThreadComment();

  if (!createThreadCommentState) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const content = createThreadCommentState.content;

    if (content && content.length > COMMENT_LIMIT[0]) {
      return createThreadCommentMutation.mutate();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    return updateCreateThreadCommentMutation.mutate({
      content: e.target.value,
    });
  };

  useEffect(() => {
    if (params.id)
      updateCreateThreadCommentMutation.mutate({ threadId: params.id });
  }, [params]);

  useEffect(() => {
    const content = createThreadCommentState.content;

    if (!content) return;

    if (content.length >= COMMENT_LIMIT[1]) {
      setError("max-limit");
    } else if (error && content.length < COMMENT_LIMIT[1]) {
      setError(null);
    }
  }, [createThreadCommentState.content]);

  const type = createThreadCommentState.type || "single";
  const isValid =
    createThreadCommentState.content &&
    createThreadCommentState.content.length >= COMMENT_LIMIT[0];

  return (
    <CreateThreadCommentFormLayout
      onSubmit={onSubmit}
      variant={type}
      state={createThreadCommentState.formState?.active ? "active" : "none"}
    >
      <div className="flex items-center h-full w-full justify-between px-4 py-4">
        <Avatar
          className="self-start min-h-[36px] min-w-[36px]"
          variant="page"
          propWidth={36}
          propHeight={36}
          nickname={currentUser.nickname}
        />
        <div className="flex w-full *:w-full h-fit rounded-md">
          <FormField>
            <Input
              id="content"
              type="text"
              backgroundType="transparent"
              placeholder="Напишите что-нибудь"
              className="w-full min-h-[36px] max-h-[200px]"
              onChange={onChange}
              value={createThreadCommentState.content || ""}
              maxLength={COMMENT_LIMIT[1]}
            />
          </FormField>
        </div>
        <Button
          variant="default"
          className="shadow-none bg-transparent border-none p-0 m-0"
          disabled={!isValid || createThreadCommentMutation.isPending}
        >
          <SendHorizontal
            size={26}
            className={isValid ? "text-caribbean-green-500" : "text-shark-300"}
          />
        </Button>
      </div>
      {error && (
        <div className="flex px-4 pb-2">
          <span className="text-red-500 text-[15px] font-normal">
            {error === "max-limit" &&
              "Вы достигли максимальное кол-во символов"}
          </span>
        </div>
      )}
    </CreateThreadCommentFormLayout>
  );
};
