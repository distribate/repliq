import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../schemas/post-field-schema.ts";
import { postFormFieldAtom } from "../models/post-form.model.ts";
import { z } from "zod";
import { POST_CONTENT_LIMIT } from "@repo/shared/constants/limits.ts";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";
import { reatomComponent } from "@reatom/npm-react";

type createPostFormInferSchema = z.infer<typeof postSchema>;

const bannedWords = ["fuck", "shit", "сука", "бля", "идиот", "глупый"];

export const sanitizeInput = (input: string): string => {
  let sanitized = input;

  sanitized = sanitized.replace(/\s{3,}/g, " ");

  const attackPattern =
    /<script.*?>.*?<\/script>|onerror=|onload=|SELECT.*?FROM|DROP TABLE|INSERT INTO|DELETE FROM/gi;
  sanitized = sanitized.replace(attackPattern, "");

  const bannedPattern = new RegExp(
    `(?<!\\w)(${bannedWords.join("|")})(?!\\w)`,
    "giu",
  );
  sanitized = sanitized.replace(bannedPattern, "***");

  return sanitized;
};

export const PostTextForm = reatomComponent(({ ctx }) => {
  const { visibility, content } = ctx.spy(postFormFieldAtom)
  const { register, reset } = useForm<createPostFormInferSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: { visibility: visibility || "all" },
  });

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    const formatted = sanitizeInput(value);
    const formattedValue = formatted.length >= 1 ? formatted : null;

    return postFormFieldAtom(ctx, (state) => ({ ...state, content: formattedValue }))
  };

  return (
    <AutogrowingTextarea
      id="post-content"
      placeholder="Напишите что-нибудь"
      maxLength={POST_CONTENT_LIMIT[1]}
      value={content ?? ""}
      className="text-[18px] !resize-none !px-2 mb-2 h-full"
      onClick={() => postFormFieldAtom(ctx, (state) => ({ ...state, isActive: true }))}
      {...register("content", {
        onChange: onChange,
        pattern: {
          value: /^(?!.* {3}).*$/i,
          message: "",
        },
      })}
    />
  );
}, "PostTextForm")