import { useMutation, useMutationState } from "@tanstack/react-query";

export const SELECT_COMMENT_MUTATION_KEY = (commentId: number) => [
  "selected-comment",
  commentId,
];

export const useHighlight = (commentId: number) => {
  const mutData = useMutationState({
    filters: { mutationKey: SELECT_COMMENT_MUTATION_KEY(commentId) },
    select: (m) => m.state.data,
  });

  const selectCommentMutation = useMutation({
    mutationKey: SELECT_COMMENT_MUTATION_KEY(commentId),
    mutationFn: async () => commentId,
    gcTime: 2000,
  });

  const selectItem = () => {
    if (mutData.length >= 1) {
      return selectCommentMutation.reset();
    }

    selectCommentMutation.mutate();
  };

  return { selectItem };
};
