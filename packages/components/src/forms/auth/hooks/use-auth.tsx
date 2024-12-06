import {
  findPlayerFromServerData,
  getUserFromForumAuthDetails,
} from "../queries/get-user-by-nickname.ts";
import { createSessionAction } from "@repo/lib/actions/create-session.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY, AuthQuery } from "../queries/auth-query.ts";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { useRouter } from "next/navigation";
import { createForumUser } from '#forms/auth/queries/create-forum-user.ts';

export const AUTH_MUTATION_KEY = ["auth-mutation"];

export const useAuth = () => {
  const qc = useQueryClient();
  const { replace } = useRouter();

  const setAuthValuesMutation = useMutation({
    mutationKey: AUTH_MUTATION_KEY,
    mutationFn: async () => {
      const authValues = qc.getQueryData<AuthQuery>(AUTH_QUERY_KEY);
      if (!authValues || !authValues.values) return;

      const { values, type } = authValues;
      const { findout, password, nickname, realName } = values;

      if (type === "sign-in") {
        const originalAuthDetails: boolean =
          await findPlayerFromServerData(nickname);

        if (!originalAuthDetails) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev,
            status: "notFound",
          }));
        }

        const forumAuthDetails = await getUserFromForumAuthDetails(nickname);

        if (originalAuthDetails) {
          if (!forumAuthDetails) {
            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev,
              status: "notFound",
            }));
          }

          if (forumAuthDetails) {
            const { nickname, id } = forumAuthDetails;

            const createSessionError = await createSessionAction({
              nickname,
              userId: id,
              password,
            });

            if (createSessionError.error) {
              return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
                ...prev,
                status: "incorrectPassword",
              }));
            }

            return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
          }
        }
      }

      if (type === "sign-up") {
        const forumAuthDetails = await getUserFromForumAuthDetails(nickname);

        if (!forumAuthDetails) {
          const res = await createForumUser({
            nickname,
            password,
            realName,
            findout,
          });

          if ("error" in res) {
            if (res.error === "User not found") {
              return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
                ...prev,
                status: "notFound",
              }));
            }

            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev,
              status: "incorrectPassword",
            }));
          }

          if (res.success) {
            qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev,
              status: "created",
            }));

            qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
            return replace(AUTH_REDIRECT);
          }
        }

        if (forumAuthDetails) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev,
            status: "alreadyForum",
          }));
        }
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { setAuthValuesMutation };
};
