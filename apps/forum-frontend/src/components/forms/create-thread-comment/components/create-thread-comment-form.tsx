import { useEffect, useState } from "react";
import { useCreateThreadComment } from "../hooks/use-create-thread-comment.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { createThreadCommentQuery } from "../queries/create-thread-comment-query.ts";
import { CreateThreadCommentLayout } from "./create-thread-comment-layout.tsx";
import { useParams } from "@tanstack/react-router";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { COMMENT_LIMIT } from "@repo/shared/constants/limits.ts";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";
import { createThreadCommentSchema } from "../schemas/create-thread-comment-schema.ts";
import { Suspense } from "react"

type createThreadForm = z.infer<typeof createThreadCommentSchema>

export const CreateThreadCommentForm = () => {
  const { id: paramId } = useParams({ from: "/_protected/thread/$id" });

  const { nickname } = getUser();
  const { data: createThreadCommentState } = createThreadCommentQuery();
  const { updateCreateThreadCommentMutation, createThreadCommentMutation } = useCreateThreadComment();
  const [isActive, setIsActive] = useState<boolean>(false);

  const { formState: { isValid }, handleSubmit, control, reset } = useForm<createThreadForm>({
    mode: "onChange",
    resolver: zodResolver(createThreadCommentSchema),
    defaultValues: {
      content: createThreadCommentState?.content ?? "",
    },
  })

  if (!paramId) return null;

  const onSubmit = async () => {
    if (!createThreadCommentState) return;

    if (isValid) {
      return createThreadCommentMutation.mutateAsync().then(() => reset());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (paramId) {
      updateCreateThreadCommentMutation.mutate({ threadId: paramId });
    }
  }, [paramId]);

  const type = createThreadCommentState?.type || "single";

  return (
    <CreateThreadCommentLayout
      variant={type}
      state={isActive ? "active" : "none"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-start h-full w-full justify-between px-4 py-4">
        <Suspense fallback={null}>
        <Avatar
          className="self-start min-h-[36px] min-w-[36px]"
          variant="page"
          propWidth={36}
          propHeight={36}
          nickname={nickname}
        />
        </Suspense>
        <div className="flex w-full items-start *:w-full h-fit">
          <Controller
            render={({ field: { onChange, onBlur, value } }) => (
              <AutogrowingTextarea
                id="content"
                placeholder="Напишите что-нибудь"
                className="flex w-full text-[16px] items-start resize-none min-h-[36px] max-h-[200px]"
                onFocus={() => setIsActive(false)}
                maxLength={COMMENT_LIMIT[1]}
                onBlur={() => {
                  onBlur()
                  setIsActive(true)
                }}
                onChange={(e) => {
                  onChange(e)
                  updateCreateThreadCommentMutation.mutate({ content: e.target.value })
                }}
                value={value}
                onKeyDown={handleKeyDown}
              />
            )}
            name="content"
            control={control}
          />
        </div>
        <Button
          type="submit"
          variant="default"
          className="shadow-none bg-transparent border-none relative top-1 p-0 m-0"
          disabled={!isValid || createThreadCommentMutation.isPending}
        >
          <SendHorizontal
            size={26}
            className={isValid ? "text-caribbean-green-500" : "text-shark-300"}
          />
        </Button>
      </form>
    </CreateThreadCommentLayout>
  );
};