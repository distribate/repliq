"use client";

import { useEffect, useState } from "react";
import { useCreateThreadComment } from "../hooks/use-create-thread-comment.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { createThreadCommentQuery } from "../queries/create-thread-comment-query.ts";
import { CreateThreadCommentLayout } from "./create-thread-comment-layout.tsx";
import { useParams } from "next/navigation";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { COMMENT_LIMIT } from "@repo/shared/constants/limits.ts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";

const createThreadCommentSchema = z.object({
  content: z.string().min(COMMENT_LIMIT[0]).max(COMMENT_LIMIT[1]),
})

export const CreateThreadCommentForm = () => {
  const params = useParams<{ id: string }>();
  const { nickname } = getUser();
  const { data: createThreadCommentState } = createThreadCommentQuery();
  const { updateCreateThreadCommentMutation, createThreadCommentMutation } = useCreateThreadComment();
  const [isActive, setIsActive] = useState<boolean>(false);

  const { formState: { isValid }, handleSubmit, register, reset } = useForm<z.infer<typeof createThreadCommentSchema>>({
    mode: "onChange",
    resolver: zodResolver(createThreadCommentSchema),
    defaultValues: {
      content: createThreadCommentState?.content ?? "",
    },
  })

  if (!params.id) return null;

  const onSubmit = async () => {
    if (!createThreadCommentState) return;

    if (isValid) {
      return createThreadCommentMutation.mutateAsync().then(() => reset());
    }
  };

  useEffect(() => {
    if (params.id) {
      updateCreateThreadCommentMutation.mutate({ threadId: params.id });
    }
  }, [params]);

  const type = createThreadCommentState?.type || "single";

  return (
    <>
      <CreateThreadCommentLayout
        variant={type}
        state={isActive ? "active" : "none"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start h-full w-full justify-between px-4 py-4">
          <Avatar
            className="self-start min-h-[36px] min-w-[36px]"
            variant="page"
            propWidth={36}
            propHeight={36}
            nickname={nickname}
          />
          <div className="flex w-full items-start *:w-full h-fit">
            <AutogrowingTextarea
              id="content"
              placeholder="Напишите что-нибудь"
              className="flex w-full text-[16px] items-start resize-none min-h-[36px] max-h-[200px]"
              onFocus={() => setIsActive(false)}
              maxLength={COMMENT_LIMIT[1]}
              {...register("content", {
                onChange: (e) => {
                  updateCreateThreadCommentMutation.mutate({ content: e.target.value })
                },
                onBlur: () => setIsActive(true)
              })}
            />
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
        </form>
      </CreateThreadCommentLayout>
    </>
  );
};