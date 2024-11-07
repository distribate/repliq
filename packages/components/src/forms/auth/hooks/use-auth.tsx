import { getUserFromOriginalAuthDetails, getUserFromForumAuthDetails } from '../queries/get-user-by-nickname.ts';
import { createNewUserInForum } from '@repo/lib/edge-functions/create-new-user-forum.ts';
import { createSessionAction } from '@repo/lib/actions/create-session.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@repo/shared/options/mutation-options.ts';
import { createUserSecurityCredentials } from '@repo/lib/actions/create-user-security-credentials.ts';
import { AUTH_QUERY_KEY, AuthQuery } from '../queries/auth-query.ts';
import { createUserAdditionalCredentials } from '@repo/lib/actions/create-user-additional-credentials.ts';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';

export const useAuth = () => {
  const qc = useQueryClient();
  
  const setAuthValuesMutation = useMutation({
    ...mutationOptions,
    mutationFn: async({ values, type }: Omit<AuthQuery, 'formState'>) => {
      if (!values || !type) return;
      
      const { findout, password, email, nickname } = values;
      
      const { data: originalAuthDetails } = await getUserFromOriginalAuthDetails(nickname);
      
      // Если не зарегистрирован ни на сервере, ни на форуме
      if (!originalAuthDetails) {
        return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
          ...prev, formState: { error: 'notFound', status: 400 }, // не найден,
        }));
      }
      
      const { data: forumAuthDetails, error: forumAuthDetailsError } = await getUserFromForumAuthDetails(nickname);
      
      // Если тип авторизации - вход
      if (type === 'sign-in') {
        if (originalAuthDetails) {
          // Если юзер не найден в таблице зарегистрированных на форуме, но найден в зарегистрированных на сервере
          // то редирект на страницу регистрации и вывод уведомления о существущем юзере.
          if (!forumAuthDetails) {
            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev,
              formState: { error: 'notFound', status: 400 },
            }));
          }
          
          // Если юзер уже зарегистрирован и вводные данные правильные, то создаем сессию
          if (!forumAuthDetailsError && forumAuthDetails) {
            const error = await createSessionAction({
              nickname: forumAuthDetails.nickname,
              id: forumAuthDetails.id,
              password: password,
            });
            
            // Если произошла ошибка при создании сессии, что значит, что введенный пароль юзера
            // неправильный - выводим ошибку о невалидном пароле
            if (error) {
              return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
                ...prev, formState: { error: 'incorrectPassword', status: 400 },
              }));
            } else {
              // Очищаем кеш
              return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
            }
          }
        }
      }
      
      // Если тип авторизации - регистрация
      if (type === 'sign-up') {
        // Если юзер не зарегистрирован на форуме
        if (!forumAuthDetails) {
          const isCreatedSecurityCred = await createUserSecurityCredentials({
            email, nickname
          });
          
          await createUserAdditionalCredentials({
            nickname, findout
          });
          
          if (!isCreatedSecurityCred) {
            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev, formState: { error: 'something', status: 400 },
            }));
          }
          
          // Создание нового юзера с введенными никнеймом и паролем
          const { error: createNewUserForumError, status } = await createNewUserInForum({
            nickname, password,
          });
          
          // Если регистрация успешна
          if (status === 204) {
            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev, formState: { error: 'created', status: 204 },
            }));
          }
          
          // Если произошла ошибка при регистрации или пароль невеный
          if (createNewUserForumError || status === 400) {
            return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
              ...prev, formState: { error: 'incorrectPassword', status: 400 },
            }));
          }
        }
        
        // Если юзер уже зарегистрирован на форуме
        if (forumAuthDetails) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev, formState: { error: 'alreadyForum', status: 400 },
          }));
        }
      }
    },
    onSuccess: async() => {
      await Promise.all([
        qc.prefetchQuery({ queryKey: CURRENT_USER_QUERY_KEY }),
        qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY }),
      ]);
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { setAuthValuesMutation };
};