import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFriendsFiltering = () => {
  const qc = useQueryClient();

  const searchFriendsMutation = useMutation({
    mutationFn: async () => {},
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { searchFriendsMutation };
};
