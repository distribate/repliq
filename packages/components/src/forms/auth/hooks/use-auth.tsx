import { findPlayerFromServerData, getUserFromForumAuthDetails } from '../queries/get-user-by-nickname.ts';
import { createSessionAction } from '@repo/lib/actions/create-session.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@repo/shared/options/mutation-options.ts';
import { AUTH_QUERY_KEY, AuthQuery } from '../queries/auth-query.ts';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { useRouter } from 'next/navigation';
import { createForumUser } from '@repo/lib/actions/create-forum-user.ts';

export const AUTH_MUTATION_KEY = [ 'auth-mutation' ];

export const useAuth = () => {
  const qc = useQueryClient();
  const { replace } = useRouter();
  
  const setAuthValuesMutation = useMutation({
    ...mutationOptions,
    mutationKey: AUTH_MUTATION_KEY,
    mutationFn: async() => {
      const authValues = qc.getQueryData<AuthQuery>(AUTH_QUERY_KEY);
      if (!authValues || !authValues.values) return;
      
      const type = authValues.type;
      const { findout, password, nickname, realName } = authValues.values;
      
      const originalAuthDetails: boolean = await findPlayerFromServerData(nickname);
      
      // Если не зарегистрирован ни на сервере, ни на форуме
      if (!originalAuthDetails) {
        return qc.setQueryData(
          AUTH_QUERY_KEY, (prev: AuthQuery) =>
            ({ ...prev, formState: { error: 'notFound', status: 400 } }),
        );
      }
      
      if (type === 'sign-in') {
        const forumAuthDetails = await getUserFromForumAuthDetails(nickname);
        
        if (originalAuthDetails) {
          // Если юзер не найден в таблице зарегистрированных на форуме, но найден в зарегистрированных на сервере
          // то вывод уведомления о существущем юзере.
          if (!forumAuthDetails) {
            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev,
              formState: { error: 'notFound', status: 400 },
            }));
          }
          
          // Если юзер уже зарегистрирован и вводные данные правильные, то создаем сессию
          if (forumAuthDetails) {
            const { nickname, id } = forumAuthDetails;
            
            const error = await createSessionAction({ nickname: nickname, id, password });
            
            // Если произошла ошибка при создании сессии, что значит, что введенный пароль юзера
            // неправильный - выводим ошибку о невалидном пароле
            if (error) {
              return qc.setQueryData(
                AUTH_QUERY_KEY,
                (prev: AuthQuery) =>
                  ({ ...prev, formState: { error: 'incorrectPassword', status: 400 } }),
              );
            } else {
              return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
            }
          }
        }
      }
      
      if (type === 'sign-up') {
        const forumAuthDetails = await getUserFromForumAuthDetails(nickname);
        
        if (!forumAuthDetails) {
          const { status, error } = await createForumUser({ nickname, password, realName, findout });
          
          if (status === 201 && !error) {
            qc.setQueryData(
              AUTH_QUERY_KEY,
              (prev: AuthQuery) =>
                ({ ...prev, formState: { error: 'created', status } }),
            );
            
            replace(AUTH_REDIRECT);
          }
          
          if (error) {
            return qc.setQueryData(
              AUTH_QUERY_KEY,
              (prev: AuthQuery) =>
                ({ ...prev, formState: { error: 'incorrectPassword', status: 400 } }),
            );
          }
        }
        
        if (forumAuthDetails) {
          return qc.setQueryData(
            AUTH_QUERY_KEY,
            (prev: AuthQuery) =>
              ({ ...prev, formState: { error: 'alreadyForum', status: 400 } }),
          );
        }
      }
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { setAuthValuesMutation };
};