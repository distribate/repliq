import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileThreadsSettingsQuery } from "#profile/components/threads/queries/profile-threads-settings-query.ts";
import { getThreadsUser } from "#profile/components/threads/queries/get-threads-user.ts";
import { THREADS_QUERY_KEY } from "#profile/components/threads/queries/profile-threads-query.ts";

export const useProfileThreadsSearch = () => {
  const qc = useQueryClient();
  const { data: profileThreadsSettingsState } = profileThreadsSettingsQuery();

  const searchThreadsMutation = useMutation({
    mutationFn: async (nickname: string) => {
      const { querySearch } = profileThreadsSettingsState;

      if (!querySearch) return;

      return await getThreadsUser({ nickname, querySearch });
    },
    onSuccess: async (data, variables) => {
      if (!data) return;

      return qc.setQueryData(THREADS_QUERY_KEY(variables), () => data);
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { searchThreadsMutation };
};
