import { useMutation, useQueryClient } from "@tanstack/react-query";

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
