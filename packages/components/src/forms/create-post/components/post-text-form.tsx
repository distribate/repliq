import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostFormControl } from "../hooks/use-post-form-control.ts";
import { postSchema } from "../schemas/post-field-schema.ts";
import { postFormQuery } from "../queries/post-form-query.ts";
import { z } from "zod";
import { POST_CONTENT_LIMIT } from "@repo/shared/constants/limits.ts";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";

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

export const PostTextForm = () => {
  const { postFormFieldsMutation } = usePostFormControl();
  const { data: createPostFormState } = postFormQuery();
  const { visibility, content } = createPostFormState;

  const { register, reset } = useForm<createPostFormInferSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      visibility: visibility || "all",
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    const formatted = sanitizeInput(value);
    const formattedValue = formatted.length >= 1 ? formatted : null;

    return postFormFieldsMutation.mutate({ content: formattedValue });
  };

  return (
    <AutogrowingTextarea
      id="post-content"
      placeholder="Что нового?"
      maxLength={POST_CONTENT_LIMIT[1]}
      value={createPostFormState.content ?? ""}
      className="text-[16px] !px-1 mb-2 h-full"
      onClick={() => postFormFieldsMutation.mutate({ isActive: true })}
      {...register("content", {
        onChange: onChange,
        pattern: {
          value: /^(?!.* {3}).*$/i,
          message: "",
        },
      })}
    />
  );
};
