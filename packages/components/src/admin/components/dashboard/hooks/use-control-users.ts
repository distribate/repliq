import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_USERS_QUERY_KEY } from "../queries/users-query.ts";
import { controlBanUser } from "../queries/control-ban-user.ts";
import { BanUser } from "../types/ban-user-types.ts";

export const useControlUsers = () => {
  const qc = useQueryClient();

  const banUserMutation = useMutation({
    mutationFn: async (values: BanUser) => controlBanUser(values),
    onSuccess: async (data) =>
      await qc.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY }),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { banUserMutation };
};
