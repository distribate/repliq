import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { POST_COMMENTS_QUERY_KEY } from "#post/components/post-comments/queries/post-comments-query.ts";

type ControlCommentType = "remove" | "edit";

type ControlComment = {
  type: ControlCommentType;
  post_id: string;
};

export const useControlComment = () => {
  const controlCommentMutation = useMutation({
    mutationFn: async (values: ControlComment) => {
      if (!values) return;

      // switch(values.type) {
      //   case 'remove':
      //     return removePostComment({ id: values.id });
      //   case 'edit':
      //
      // }
    },
    // onSuccess: async(data, variables) => {
    //   if (!data || !variables) return toast.error('Произошла ошибка');
    //
    //   return qc.invalidateQueries({
    //     queryKey: POST_COMMENTS_QUERY_KEY(variables.post_id),
    //   });
    // },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { controlCommentMutation };
};
